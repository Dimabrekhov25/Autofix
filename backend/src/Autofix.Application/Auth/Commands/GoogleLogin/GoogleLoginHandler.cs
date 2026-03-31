using Autofix.Application.Auth.Dtos;
using Autofix.Application.Common.Interfaces.Auth;
using MediatR;

namespace Autofix.Application.Auth.Commands.GoogleLogin;

public sealed class GoogleLoginHandler(IIdentityService identityService)
    : IRequestHandler<GoogleLoginCommand, AuthResponseDto>
{
    public Task<AuthResponseDto> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
    {
        return identityService.LoginWithGoogleAsync(request.IdToken, cancellationToken);
    }
}
