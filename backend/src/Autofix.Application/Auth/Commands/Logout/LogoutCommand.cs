using MediatR;

namespace Autofix.Application.Auth.Commands.Logout;

/// <summary>
/// Revokes the given refresh token for the authenticated user (no response body in MediatR unit request).
/// </summary>
public sealed record LogoutCommand(string RefreshToken) : IRequest;
