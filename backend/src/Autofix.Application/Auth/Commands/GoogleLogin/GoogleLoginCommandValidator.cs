using FluentValidation;

namespace Autofix.Application.Auth.Commands.GoogleLogin;

/// <summary>
/// Validation for <see cref="GoogleLoginCommand"/> (non-empty token, max length).
/// </summary>
public sealed class GoogleLoginCommandValidator : AbstractValidator<GoogleLoginCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public GoogleLoginCommandValidator()
    {
        RuleFor(x => x.IdToken)
            .NotEmpty()
            .MaximumLength(4096);
    }
}
