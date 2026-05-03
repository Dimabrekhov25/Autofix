namespace Autofix.Application.Auth.Dtos;

/// <summary>
/// Profile for the authenticated user (e.g. <c>/auth/me</c>).
/// </summary>
public sealed record CurrentUserDto(
    Guid Id,
    string UserName,
    string Email,
    string FullName,
    bool IsActive,
    IReadOnlyCollection<string> Roles
);
