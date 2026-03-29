using Autofix.Application.Common.Interfaces;
using Autofix.Application.Users.Dtos;
using Autofix.Application.Users.Mapping;
using MediatR;

namespace Autofix.Application.Users.Queries.GetUserById;

public sealed class GetUserByIdHandler(IUserRepository repository)
    : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await repository.GetByIdAsync(request.Id, cancellationToken);
        return user?.ToDto();
    }
}
