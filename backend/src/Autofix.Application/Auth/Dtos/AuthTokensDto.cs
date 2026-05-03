namespace Autofix.Application.Auth.Dtos;

/// <summary>
/// JWT access token and refresh token with UTC expiry instants.
/// </summary>
public sealed record AuthTokensDto(
    string AccessToken,
    DateTime AccessTokenExpiresAtUtc,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc
);
