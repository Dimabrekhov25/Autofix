using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Commands.Login;

/// <summary>
/// Password login using username or email plus password.
/// </summary>
public sealed record LoginCommand(
    string UserNameOrEmail,
    string Password
) : IRequest<AuthResponseDto>;
