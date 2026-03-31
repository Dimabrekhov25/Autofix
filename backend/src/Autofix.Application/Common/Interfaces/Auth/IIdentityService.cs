using Autofix.Application.Auth.Dtos;

namespace Autofix.Application.Common.Interfaces.Auth;

public interface IIdentityService
{
    Task<AuthResponseDto> RegisterAsync(
        string userName,
        string email,
        string fullName,
        string password,
        CancellationToken cancellationToken);

    Task<AuthResponseDto> LoginAsync(
        string userNameOrEmail,
        string password,
        CancellationToken cancellationToken);

    Task<AuthResponseDto> LoginWithGoogleAsync(
        string idToken,
        CancellationToken cancellationToken);

    Task<AuthResponseDto> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken);

    Task LogoutAsync(
        Guid userId,
        string refreshToken,
        CancellationToken cancellationToken);

    Task<CurrentUserDto> GetCurrentUserAsync(
        Guid userId,
        CancellationToken cancellationToken);
}
