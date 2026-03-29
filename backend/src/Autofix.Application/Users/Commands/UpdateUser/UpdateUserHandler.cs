using Autofix.Application.Common.Interfaces;
using Autofix.Application.Users.Dtos;
using Autofix.Application.Users.Mapping;
using MediatR;

namespace Autofix.Application.Users.Commands.UpdateUser;

public sealed class UpdateUserHandler(IUserRepository repository)
    : IRequestHandler<UpdateUserCommand, UserDto?>
{
    public async Task<UserDto?> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (user is null)
        {
            return null;
        }

        user.Username = request.Username;
        user.PasswordHash = request.PasswordHash;
        user.Role = request.Role;
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        await repository.UpdateAsync(user, cancellationToken);
        return user.ToDto();
    }
}
