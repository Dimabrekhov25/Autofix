using Autofix.Application.Auth.Dtos;
using Autofix.Application.Common.Interfaces.Auth;
using Autofix.Application.Common.Interfaces.CurrentUser;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Auth.Queries.GetCurrentUser;

public sealed class GetCurrentUserHandler(
    ICurrentUserService currentUserService,
    IIdentityService identityService) : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
{
    public Task<CurrentUserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId;
        if (userId is null)
        {
            throw new UnauthorizedException("The current user could not be resolved.");
        }

        return identityService.GetCurrentUserAsync(userId.Value, cancellationToken);
    }
}
