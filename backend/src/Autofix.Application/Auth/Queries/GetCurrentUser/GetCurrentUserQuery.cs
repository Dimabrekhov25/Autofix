using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Queries.GetCurrentUser;

public sealed record GetCurrentUserQuery : IRequest<CurrentUserDto>;
