namespace Autofix.Api.Contracts.Auth;

/// <summary>
/// HTTP body for revoking a refresh token on logout.
/// </summary>
public sealed record LogoutRequest(string RefreshToken);
