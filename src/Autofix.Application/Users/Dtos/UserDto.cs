using Autofix.Domain.Enum;

namespace Autofix.Application.Users.Dtos;

public sealed record UserDto(
    Guid Id,
    string Username,
    string PasswordHash,
    UserRole Role,
    bool IsActive
);
