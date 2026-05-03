using FluentValidation;

namespace Autofix.Application.Parts.Commands.DeletePart;

/// <summary>
/// Validation for <see cref="DeletePartCommand"/>.
/// </summary>
public sealed class DeletePartCommandValidator : AbstractValidator<DeletePartCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public DeletePartCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
