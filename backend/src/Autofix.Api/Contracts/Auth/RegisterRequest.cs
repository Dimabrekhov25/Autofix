namespace Autofix.Api.Contracts.Auth;

public sealed record RegisterRequest(
    string UserName,
    string Email,
    string FullName,
    string Password
);
