namespace Autofix.Api.Contracts.Auth;

/// <summary>
/// HTTP body for refreshing JWTs.
/// </summary>
public sealed record RefreshTokenRequest(string RefreshToken);
