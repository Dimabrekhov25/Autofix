using FluentValidation;

namespace Autofix.Application.Diagnosis.Commands.UpdateDiagnosisItem;

public sealed class UpdateDiagnosisItemCommandValidator : AbstractValidator<UpdateDiagnosisItemCommand>
{
    public UpdateDiagnosisItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.Severity)
            .IsInEnum().WithMessage("Severity must be a valid value");
    }
}
