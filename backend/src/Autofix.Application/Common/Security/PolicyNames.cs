namespace Autofix.Application.Common.Security;

/// <summary>
/// ASP.NET Core authorization policy names used by the API.
/// </summary>
public static class PolicyNames
{
    /// <summary>Requires an authenticated, active user account.</summary>
    public const string ActiveUser = "ActiveUser";
    /// <summary>Requires administrator privileges.</summary>
    public const string AdminOnly = "AdminOnly";
}
