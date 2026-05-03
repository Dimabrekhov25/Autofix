using FluentValidation;

namespace Autofix.Application.Auth.Commands.RefreshToken;

/// <summary>
/// Validation for <see cref="RefreshTokenCommand"/>.
/// </summary>
public sealed class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty();
    }
}
