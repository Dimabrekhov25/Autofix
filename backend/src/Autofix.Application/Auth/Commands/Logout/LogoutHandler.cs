using Autofix.Application.Common.Interfaces.Auth;
using Autofix.Application.Common.Interfaces.CurrentUser;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Auth.Commands.Logout;

public sealed class LogoutHandler(
    IIdentityService identityService,
    ICurrentUserService currentUserService) : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        // Logout requires a resolved authenticated user to revoke the provided refresh token.
        var userId = currentUserService.UserId;
        if (userId is null)
        {
            throw new UnauthorizedException("The current user could not be resolved.");
        }

        await identityService.LogoutAsync(userId.Value, request.RefreshToken, cancellationToken);
    }
}
