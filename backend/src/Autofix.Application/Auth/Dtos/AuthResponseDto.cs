namespace Autofix.Application.Auth.Dtos;

public sealed record AuthResponseDto(
    AuthUserDto User,
    AuthTokensDto Tokens
);
