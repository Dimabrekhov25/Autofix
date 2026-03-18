using Autofix.Application.Common.Interfaces;
using Autofix.Application.Users.Dtos;
using Autofix.Application.Users.Mapping;
using Autofix.Domain.Entities.People;
using MediatR;

namespace Autofix.Application.Users.Commands.CreateUser;

public sealed class CreateUserHandler(IUserRepository repository)
    : IRequestHandler<CreateUserCommand, UserDto>
{
    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new User
        {
            Username = request.Username,
            PasswordHash = request.PasswordHash,
            Role = request.Role,
            IsActive = request.IsActive
        };

        var saved = await repository.AddAsync(user, cancellationToken);
        return saved.ToDto();
    }
}
