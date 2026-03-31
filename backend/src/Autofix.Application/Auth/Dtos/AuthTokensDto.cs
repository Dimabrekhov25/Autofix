namespace Autofix.Application.Auth.Dtos;

public sealed record AuthTokensDto(
    string AccessToken,
    DateTime AccessTokenExpiresAtUtc,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc
);
