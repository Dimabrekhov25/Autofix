using MediatR;

namespace Autofix.Application.Users.Commands.DeleteUser;

public sealed record DeleteUserCommand(Guid Id) : IRequest<bool>;
