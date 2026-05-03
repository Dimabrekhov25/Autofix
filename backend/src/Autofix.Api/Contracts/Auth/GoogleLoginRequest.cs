namespace Autofix.Api.Contracts.Auth;

/// <summary>
/// HTTP body for Google Sign-In (ID token from the client).
/// </summary>
public sealed record GoogleLoginRequest(string IdToken);
