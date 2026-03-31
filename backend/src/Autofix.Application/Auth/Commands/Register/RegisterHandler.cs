using Autofix.Application.Auth.Dtos;
using Autofix.Application.Common.Interfaces.Auth;
using MediatR;

namespace Autofix.Application.Auth.Commands.Register;

public sealed class RegisterHandler(IIdentityService identityService)
    : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    public Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return identityService.RegisterAsync(
            request.UserName,
            request.Email,
            request.FullName,
            request.Password,
            cancellationToken);
    }
}
