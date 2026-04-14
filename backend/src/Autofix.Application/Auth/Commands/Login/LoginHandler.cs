using Autofix.Application.Auth.Dtos;
using Autofix.Application.Common.Interfaces.Auth;
using MediatR;

namespace Autofix.Application.Auth.Commands.Login;

public sealed class LoginHandler(IIdentityService identityService)
    : IRequestHandler<LoginCommand, AuthResponseDto>
{
    public Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Authentication and token issuance are centralized in identity service.
        return identityService.LoginAsync(
            request.UserNameOrEmail,
            request.Password,
            cancellationToken);
    }
}
