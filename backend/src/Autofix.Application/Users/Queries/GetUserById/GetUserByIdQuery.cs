using Autofix.Application.Users.Dtos;
using MediatR;

namespace Autofix.Application.Users.Queries.GetUserById;

public sealed record GetUserByIdQuery(Guid Id) : IRequest<UserDto?>;
