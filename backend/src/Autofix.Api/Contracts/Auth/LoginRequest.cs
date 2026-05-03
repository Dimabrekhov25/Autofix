namespace Autofix.Api.Contracts.Auth;

/// <summary>
/// HTTP body for password login.
/// </summary>
public sealed record LoginRequest(
    string UserNameOrEmail,
    string Password
);
