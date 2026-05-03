namespace Autofix.Application.Auth.Dtos;

/// <summary>
/// User profile returned immediately after sign-in or registration.
/// </summary>
public sealed record AuthUserDto(
    Guid Id,
    string UserName,
    string Email,
    string FullName,
    bool IsActive,
    IReadOnlyCollection<string> Roles
);
