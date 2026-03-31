namespace Autofix.Application.Auth.Dtos;

public sealed record CurrentUserDto(
    Guid Id,
    string UserName,
    string Email,
    string FullName,
    bool IsActive,
    IReadOnlyCollection<string> Roles
);
