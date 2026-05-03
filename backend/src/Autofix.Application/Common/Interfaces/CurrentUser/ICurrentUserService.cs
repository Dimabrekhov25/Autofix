namespace Autofix.Application.Common.Interfaces.CurrentUser;

/// <summary>
/// Access to the authenticated user’s identity in the application layer (HTTP context abstraction).
/// </summary>
public interface ICurrentUserService
{
    /// <summary>Application user id when authenticated; otherwise <c>null</c>.</summary>
    Guid? UserId { get; }
    /// <summary>Username claim when present.</summary>
    string? UserName { get; }
    /// <summary>Email claim when present.</summary>
    string? Email { get; }
}
