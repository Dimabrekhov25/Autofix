using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Commands.Register;

/// <summary>
/// Creates a new account and returns auth tokens with the new user profile.
/// </summary>
public sealed record RegisterCommand(
    string UserName,
    string Email,
    string FullName,
    string Password
) : IRequest<AuthResponseDto>;
