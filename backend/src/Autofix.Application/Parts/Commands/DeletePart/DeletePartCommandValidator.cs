using FluentValidation;

namespace Autofix.Application.Parts.Commands.DeletePart;

public sealed class DeletePartCommandValidator : AbstractValidator<DeletePartCommand>
{
    public DeletePartCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
