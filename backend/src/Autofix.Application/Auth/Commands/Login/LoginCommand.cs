using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Commands.Login;

public sealed record LoginCommand(
    string UserNameOrEmail,
    string Password
) : IRequest<AuthResponseDto>;
