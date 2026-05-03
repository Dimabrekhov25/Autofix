namespace Autofix.Application.Auth.Dtos;

/// <summary>
/// Successful authentication payload: user profile snapshot and issued tokens.
/// </summary>
public sealed record AuthResponseDto(
    AuthUserDto User,
    AuthTokensDto Tokens
);
