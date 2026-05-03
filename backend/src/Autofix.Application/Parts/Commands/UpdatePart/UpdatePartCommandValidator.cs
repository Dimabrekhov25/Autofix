using FluentValidation;

namespace Autofix.Application.Parts.Commands.UpdatePart;

/// <summary>
/// Validation for <see cref="UpdatePartCommand"/>.
/// </summary>
public sealed class UpdatePartCommandValidator : AbstractValidator<UpdatePartCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public UpdatePartCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

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
