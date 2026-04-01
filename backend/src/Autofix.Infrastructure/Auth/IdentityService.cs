using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Text;
using Autofix.Application.Auth.Dtos;
using Autofix.Application.Common.Interfaces.Auth;
using Autofix.Domain.Constants;
using Autofix.Domain.Exceptions;
using Google.Apis.Auth;
using Autofix.Infrastructure.Auth.Entities;
using Autofix.Infrastructure.Auth.Options;
using Autofix.Infrastructure.Persistance;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Autofix.Infrastructure.Auth;

public sealed class IdentityService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ApplicationDbContext dbContext,
    IOptions<JwtOptions> jwtOptions,
    IOptions<GoogleAuthOptions> googleAuthOptions) : IIdentityService
{
    private const string GoogleLoginProvider = "Google";
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;
    private readonly GoogleAuthOptions _googleAuthOptions = googleAuthOptions.Value;
    private readonly JwtSecurityTokenHandler _tokenHandler = new();

    public async Task<AuthResponseDto> RegisterAsync(
        string userName,
        string email,
        string fullName,
        string password,
        CancellationToken cancellationToken)
    {
        var user = new ApplicationUser
        {
            UserName = userName.Trim(),
            Email = email.Trim(),
            FullName = fullName.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        var createResult = await userManager.CreateAsync(user, password);
        EnsureIdentitySucceeded(createResult);

        var roleResult = await userManager.AddToRoleAsync(user, RoleNames.User);
        EnsureIdentitySucceeded(roleResult);

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponseDto> LoginAsync(
        string userNameOrEmail,
        string password,
        CancellationToken cancellationToken)
    {
        var user = await FindUserByUserNameOrEmailAsync(userNameOrEmail, cancellationToken);
        if (user is null)
        {
            throw new UnauthorizedException("Invalid credentials.");
        }

        EnsureUserIsActive(user);

        var signInResult = await signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        if (signInResult.IsLockedOut)
        {
            throw new ForbiddenException("The user account is locked.");
        }

        if (!signInResult.Succeeded)
        {
            throw new UnauthorizedException("Invalid credentials.");
        }

        user.LastLoginAtUtc = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponseDto> LoginWithGoogleAsync(
        string idToken,
        CancellationToken cancellationToken)
    {
        if (_googleAuthOptions.AllowedAudiences.Length == 0)
        {
            throw new BadRequestException("Google authentication is not configured.");
        }

        GoogleJsonWebSignature.Payload payload;

        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(
                idToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = _googleAuthOptions.AllowedAudiences
                });
        }
        catch (InvalidJwtException)
        {
            throw new UnauthorizedException("Invalid Google token.");
        }

        if (string.IsNullOrWhiteSpace(payload.Subject))
        {
            throw new UnauthorizedException("Invalid Google token.");
        }

        if (string.IsNullOrWhiteSpace(payload.Email))
        {
            throw new BadRequestException("Google account did not provide an email address.");
        }

        if (!payload.EmailVerified)
        {
            throw new ForbiddenException("Google account email must be verified.");
        }

        var user = await FindOrProvisionGoogleUserAsync(payload, cancellationToken);
        EnsureUserIsActive(user);

        user.LastLoginAtUtc = DateTime.UtcNow;
        var updateResult = await userManager.UpdateAsync(user);
        EnsureIdentitySucceeded(updateResult);

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken)
    {
        var tokenHash = HashToken(refreshToken);
        var existingToken = await dbContext.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash, cancellationToken);

        if (existingToken is null)
        {
            throw new UnauthorizedException("Invalid refresh token.");
        }

        if (existingToken.RevokedAtUtc is not null)
        {
            await RevokeActiveRefreshTokensAsync(
                existingToken.UserId,
                "Refresh token reuse detected.",
                cancellationToken);

            throw new UnauthorizedException("Refresh token has already been used.");
        }

        if (existingToken.ExpiresAtUtc <= DateTime.UtcNow)
        {
            throw new UnauthorizedException("Refresh token has expired.");
        }

        EnsureUserIsActive(existingToken.User);

        existingToken.RevokedAtUtc = DateTime.UtcNow;
        existingToken.RevokedReason = "Rotated";

        return await IssueTokensAsync(existingToken.User, cancellationToken, existingToken);
    }

    public async Task LogoutAsync(
        Guid userId,
        string refreshToken,
        CancellationToken cancellationToken)
    {
        var tokenHash = HashToken(refreshToken);
        var existingToken = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(
                x => x.UserId == userId && x.TokenHash == tokenHash,
                cancellationToken);

        if (existingToken is null || existingToken.RevokedAtUtc is not null)
        {
            return;
        }

        existingToken.RevokedAtUtc = DateTime.UtcNow;
        existingToken.RevokedReason = "Logged out";

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<CurrentUserDto> GetCurrentUserAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var user = await userManager.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedException("The current user could not be found.");
        }

        EnsureUserIsActive(user);

        var roles = await userManager.GetRolesAsync(user);
        var roleArray = roles.ToArray();

        return new CurrentUserDto(
            user.Id,
            user.UserName ?? string.Empty,
            user.Email ?? string.Empty,
            user.FullName,
            user.IsActive,
            roleArray);
    }

    private async Task<AuthResponseDto> IssueTokensAsync(
        ApplicationUser user,
        CancellationToken cancellationToken,
        RefreshToken? rotatedToken = null)
    {
        var roles = await userManager.GetRolesAsync(user);
        var roleArray = roles.ToArray();
        var accessTokenExpiresAtUtc = DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenLifetimeMinutes);
        var accessToken = CreateAccessToken(user, roleArray, accessTokenExpiresAtUtc);

        var refreshTokenValue = GenerateRefreshToken();
        var refreshTokenHash = HashToken(refreshTokenValue);

        if (rotatedToken is not null)
        {
            rotatedToken.ReplacedByTokenHash = refreshTokenHash;
        }

        dbContext.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            CreatedAtUtc = DateTime.UtcNow,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenLifetimeDays)
        });

        await dbContext.SaveChangesAsync(cancellationToken);

        return new AuthResponseDto(
            new AuthUserDto(
                user.Id,
                user.UserName ?? string.Empty,
                user.Email ?? string.Empty,
                user.FullName,
                user.IsActive,
                roleArray),
            new AuthTokensDto(
                accessToken,
                accessTokenExpiresAtUtc,
                refreshTokenValue,
                DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenLifetimeDays)));
    }

    private async Task<ApplicationUser> FindOrProvisionGoogleUserAsync(
        GoogleJsonWebSignature.Payload payload,
        CancellationToken cancellationToken)
    {
        var externalLogin = new UserLoginInfo(GoogleLoginProvider, payload.Subject, GoogleLoginProvider);
        var user = await userManager.FindByLoginAsync(externalLogin.LoginProvider, externalLogin.ProviderKey);
        if (user is not null)
        {
            return user;
        }

        user = await userManager.FindByEmailAsync(payload.Email);
        if (user is not null)
        {
            var shouldUpdateUser = false;

            if (!user.EmailConfirmed)
            {
                user.EmailConfirmed = true;
                shouldUpdateUser = true;
            }

            if (string.IsNullOrWhiteSpace(user.FullName) && !string.IsNullOrWhiteSpace(payload.Name))
            {
                user.FullName = payload.Name.Trim();
                shouldUpdateUser = true;
            }

            if (shouldUpdateUser)
            {
                var updateResult = await userManager.UpdateAsync(user);
                EnsureIdentitySucceeded(updateResult);
            }

            var addLoginResult = await userManager.AddLoginAsync(user, externalLogin);
            EnsureIdentitySucceeded(addLoginResult);
            await EnsureUserHasDefaultRoleAsync(user);
            return user;
        }

        user = new ApplicationUser
        {
            UserName = await GenerateUniqueUserNameAsync(payload.Email, cancellationToken),
            Email = payload.Email.Trim(),
            FullName = string.IsNullOrWhiteSpace(payload.Name) ? payload.Email.Trim() : payload.Name.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(user);
        EnsureIdentitySucceeded(createResult);

        var loginResult = await userManager.AddLoginAsync(user, externalLogin);
        EnsureIdentitySucceeded(loginResult);

        var roleResult = await userManager.AddToRoleAsync(user, RoleNames.User);
        EnsureIdentitySucceeded(roleResult);

        return user;
    }

    private string CreateAccessToken(
        ApplicationUser user,
        IEnumerable<string> roles,
        DateTime expiresAtUtc)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new("full_name", user.FullName),
            new("is_active", user.IsActive.ToString().ToLowerInvariant())
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Issuer = _jwtOptions.Issuer,
            Audience = _jwtOptions.Audience,
            Expires = expiresAtUtc,
            SigningCredentials = credentials
        };

        var token = _tokenHandler.CreateToken(tokenDescriptor);
        return _tokenHandler.WriteToken(token);
    }

    private async Task EnsureUserHasDefaultRoleAsync(ApplicationUser user)
    {
        var roles = await userManager.GetRolesAsync(user);
        if (roles.Count > 0)
        {
            return;
        }

        var roleResult = await userManager.AddToRoleAsync(user, RoleNames.User);
        EnsureIdentitySucceeded(roleResult);
    }

    private async Task<ApplicationUser?> FindUserByUserNameOrEmailAsync(
        string userNameOrEmail,
        CancellationToken cancellationToken)
    {
        var normalizedValue = userNameOrEmail.Trim().ToUpperInvariant();

        return await userManager.Users
            .FirstOrDefaultAsync(
                x => x.NormalizedUserName == normalizedValue || x.NormalizedEmail == normalizedValue,
                cancellationToken);
    }

    private async Task<string> GenerateUniqueUserNameAsync(
        string email,
        CancellationToken cancellationToken)
    {
        var localPart = email.Split('@', 2)[0];
        var baseUserName = NormalizeUserName(localPart);
        if (string.IsNullOrWhiteSpace(baseUserName))
        {
            baseUserName = "googleuser";
        }

        const int maxBaseLength = 32;
        if (baseUserName.Length > maxBaseLength)
        {
            baseUserName = baseUserName[..maxBaseLength];
        }

        var candidate = baseUserName;
        var suffix = 0;

        while (await userManager.Users.AnyAsync(
                   x => x.NormalizedUserName == candidate.ToUpperInvariant(),
                   cancellationToken))
        {
            suffix++;
            var suffixText = suffix.ToString(CultureInfo.InvariantCulture);
            var availableLength = maxBaseLength - suffixText.Length;
            var trimmedBase = baseUserName[..Math.Max(1, availableLength)];
            candidate = $"{trimmedBase}{suffixText}";
        }

        return candidate;
    }

    private static string NormalizeUserName(string value)
    {
        var normalized = Regex.Replace(value.Trim(), @"[^A-Za-z0-9._-]+", string.Empty);
        return normalized.ToLowerInvariant();
    }

    private async Task RevokeActiveRefreshTokensAsync(
        Guid userId,
        string reason,
        CancellationToken cancellationToken)
    {
        var activeTokens = await dbContext.RefreshTokens
            .Where(x => x.UserId == userId && x.RevokedAtUtc == null && x.ExpiresAtUtc > DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        foreach (var activeToken in activeTokens)
        {
            activeToken.RevokedAtUtc = DateTime.UtcNow;
            activeToken.RevokedReason = reason;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private static string HashToken(string token)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hash);
    }

    private static void EnsureUserIsActive(ApplicationUser user)
    {
        if (!user.IsActive)
        {
            throw new ForbiddenException("The user account is inactive.");
        }
    }

    private static void EnsureIdentitySucceeded(IdentityResult result)
    {
        if (result.Succeeded)
        {
            return;
        }

        if (result.Errors.Any(x => x.Code is "DuplicateUserName" or "DuplicateEmail"))
        {
            throw new ConflictException(result.Errors.First().Description);
        }

        throw new BadRequestException(string.Join("; ", result.Errors.Select(x => x.Description)));
    }
}
