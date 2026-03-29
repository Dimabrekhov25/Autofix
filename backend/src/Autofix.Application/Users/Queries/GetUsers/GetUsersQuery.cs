using Autofix.Application.Users.Dtos;
using MediatR;

namespace Autofix.Application.Users.Queries.GetUsers;

public sealed record GetUsersQuery() : IRequest<IReadOnlyList<UserDto>>;
