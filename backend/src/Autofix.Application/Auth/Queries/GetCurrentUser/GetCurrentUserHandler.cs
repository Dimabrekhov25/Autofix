using Autofix.Application.Auth.Dtos;
using Autofix.Application.Common.Interfaces.Auth;
using Autofix.Application.Common.Interfaces.CurrentUser;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Auth.Queries.GetCurrentUser;

/// <summary>
/// Resolves the current user id from <see cref="ICurrentUserService"/>, then loads profile via <see cref="IIdentityService"/>.
/// </summary>
public sealed class GetCurrentUserHandler(
    ICurrentUserService currentUserService,
    IIdentityService identityService) : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
{
    /// <inheritdoc />
    public Task<CurrentUserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        // Query is scoped to authenticated principal resolved from request context.
        var userId = currentUserService.UserId;
        if (userId is null)
        {
            throw new UnauthorizedException("The current user could not be resolved.");
        }

        // Identity service provides the canonical profile projection for the current user.
        return identityService.GetCurrentUserAsync(userId.Value, cancellationToken);
    }
}
