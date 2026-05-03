using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Commands.GoogleLogin;

/// <summary>
/// Sign-in with a Google ID token from the client SDK.
/// </summary>
public sealed record GoogleLoginCommand(string IdToken) : IRequest<AuthResponseDto>;
