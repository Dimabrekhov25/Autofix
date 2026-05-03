using Autofix.Application.Auth.Dtos;
using MediatR;

namespace Autofix.Application.Auth.Queries.GetCurrentUser;

/// <summary>
/// Loads <see cref="CurrentUserDto"/> for the principal in the current request context.
/// </summary>
public sealed record GetCurrentUserQuery : IRequest<CurrentUserDto>;
