using Autofix.Application.Auth.Dtos;

namespace Autofix.Application.Common.Interfaces.Auth;

/// <summary>
/// Identity operations: registration, password and social login, tokens, logout, and current-user profile.
/// </summary>
public interface IIdentityService
{
    /// <summary>Creates a user and returns auth tokens / profile per implementation.</summary>
    Task<AuthResponseDto> RegisterAsync(
        string userName,
        string email,
        string fullName,
        string password,
        CancellationToken cancellationToken);

    /// <summary>Authenticates with username or email and password.</summary>
    Task<AuthResponseDto> LoginAsync(
        string userNameOrEmail,
        string password,
        CancellationToken cancellationToken);

    /// <summary>Authenticates using a Google ID token.</summary>
    Task<AuthResponseDto> LoginWithGoogleAsync(
        string idToken,
        CancellationToken cancellationToken);

    /// <summary>Rotates or reissues tokens from a refresh token.</summary>
    Task<AuthResponseDto> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken);

    /// <summary>Revokes the given refresh token for the user.</summary>
    Task LogoutAsync(
        Guid userId,
        string refreshToken,
        CancellationToken cancellationToken);

    /// <summary>Loads profile for an authenticated user id.</summary>
    Task<CurrentUserDto> GetCurrentUserAsync(
        Guid userId,
        CancellationToken cancellationToken);
}
