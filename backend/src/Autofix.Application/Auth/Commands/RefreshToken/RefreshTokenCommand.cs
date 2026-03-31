using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Commands.RefreshToken;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResponseDto>;
