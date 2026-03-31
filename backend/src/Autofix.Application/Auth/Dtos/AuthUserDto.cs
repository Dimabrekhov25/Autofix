namespace Autofix.Application.Auth.Dtos;

public sealed record AuthUserDto(
    Guid Id,
    string UserName,
    string Email,
    string FullName,
    bool IsActive,
    IReadOnlyCollection<string> Roles
);
