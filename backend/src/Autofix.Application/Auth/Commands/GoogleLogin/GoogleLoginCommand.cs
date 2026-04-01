using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Commands.GoogleLogin;

public sealed record GoogleLoginCommand(string IdToken) : IRequest<AuthResponseDto>;
