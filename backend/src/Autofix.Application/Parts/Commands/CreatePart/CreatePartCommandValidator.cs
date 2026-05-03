using FluentValidation;

namespace Autofix.Application.Parts.Commands.CreatePart;

/// <summary>
/// Validation for <see cref="CreatePartCommand"/>.
/// </summary>
public sealed class CreatePartCommandValidator : AbstractValidator<CreatePartCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public CreatePartCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .Must(name => !string.IsNullOrWhiteSpace(name))
            .WithMessage("Name must not be empty or whitespace.")
            .MinimumLength(2)
            .MaximumLength(200);

        RuleFor(x => x.UnitPrice)
            .GreaterThanOrEqualTo(0);
    }
}
