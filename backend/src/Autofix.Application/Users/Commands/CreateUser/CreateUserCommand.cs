using Autofix.Application.Users.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Users.Commands.CreateUser;

public sealed record CreateUserCommand(
    string Username,
    string PasswordHash,
    UserRole Role,
    bool IsActive = true
) : IRequest<UserDto>;
