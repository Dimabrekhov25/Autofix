using Autofix.Application.Auth.Dtos;
using Autofix.Application.Common.Interfaces.Auth;
using MediatR;

namespace Autofix.Application.Auth.Commands.RefreshToken;

/// <summary>
/// Delegates refresh-token rotation to <see cref="IIdentityService"/>.
/// </summary>
public sealed class RefreshTokenHandler(IIdentityService identityService)
    : IRequestHandler<RefreshTokenCommand, AuthResponseDto>
{
    /// <inheritdoc />
    public Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Token rotation and refresh-token validation are encapsulated in identity service.
        return identityService.RefreshTokenAsync(request.RefreshToken, cancellationToken);
    }
}
