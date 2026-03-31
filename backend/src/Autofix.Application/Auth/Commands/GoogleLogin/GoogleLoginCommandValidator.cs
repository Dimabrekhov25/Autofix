using FluentValidation;

namespace Autofix.Application.Auth.Commands.GoogleLogin;

public sealed class GoogleLoginCommandValidator : AbstractValidator<GoogleLoginCommand>
{
    public GoogleLoginCommandValidator()
    {
        RuleFor(x => x.IdToken)
            .NotEmpty()
            .MaximumLength(4096);
    }
}
