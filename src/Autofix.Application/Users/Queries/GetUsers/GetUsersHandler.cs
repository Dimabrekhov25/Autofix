using Autofix.Application.Common.Interfaces;
using Autofix.Application.Users.Dtos;
using Autofix.Application.Users.Mapping;
using MediatR;

namespace Autofix.Application.Users.Queries.GetUsers;

public sealed class GetUsersHandler(IUserRepository repository)
    : IRequestHandler<GetUsersQuery, IReadOnlyList<UserDto>>
{
    public async Task<IReadOnlyList<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await repository.GetAllAsync(cancellationToken);
        return users.Select(user => user.ToDto()).ToList();
    }
}
