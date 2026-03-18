using Autofix.Application.Users.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Users.Commands.UpdateUser;

public sealed record UpdateUserCommand(
    Guid Id,
    string Username,
    string PasswordHash,
    UserRole Role,
    bool IsActive
) : IRequest<UserDto?>;
