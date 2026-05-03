using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Commands.RefreshToken;

/// <summary>
/// Exchanges a refresh token for a new access (and possibly refresh) token pair.
/// </summary>
public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResponseDto>;
