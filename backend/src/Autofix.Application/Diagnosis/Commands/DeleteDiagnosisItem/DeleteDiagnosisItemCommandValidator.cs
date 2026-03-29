using FluentValidation;

namespace Autofix.Application.Diagnosis.Commands.DeleteDiagnosisItem;

public sealed class DeleteDiagnosisItemCommandValidator : AbstractValidator<DeleteDiagnosisItemCommand>
{
    public DeleteDiagnosisItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");
    }
}
