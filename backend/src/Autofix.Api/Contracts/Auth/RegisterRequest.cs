namespace Autofix.Api.Contracts.Auth;

/// <summary>
/// HTTP body for <c>POST .../auth/register</c>.
/// </summary>
public sealed record RegisterRequest(
    string UserName,
    string Email,
    string FullName,
    string Password
);
