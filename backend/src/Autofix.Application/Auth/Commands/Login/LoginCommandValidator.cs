using FluentValidation;

namespace Autofix.Application.Auth.Commands.Login;

/// <summary>
/// Validation for <see cref="LoginCommand"/> (non-empty credentials, length caps).
/// </summary>
public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public LoginCommandValidator()
    {
        RuleFor(x => x.UserNameOrEmail)
            .NotEmpty()
            .MaximumLength(256);

        RuleFor(x => x.Password)
            .NotEmpty()
            .MaximumLength(256);
    }
}
