using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Commands.Register;

public sealed record RegisterCommand(
    string UserName,
    string Email,
    string FullName,
    string Password
) : IRequest<AuthResponseDto>;
