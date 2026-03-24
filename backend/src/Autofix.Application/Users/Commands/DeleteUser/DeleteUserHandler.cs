using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Users.Commands.DeleteUser;

public sealed class DeleteUserHandler(IUserRepository repository)
    : IRequestHandler<DeleteUserCommand, bool>
{
    public Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
