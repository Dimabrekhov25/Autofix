using FluentValidation;

namespace Autofix.Application.Diagnosis.Commands.CreateDiagnosisItem;

public sealed class CreateDiagnosisItemCommandValidator : AbstractValidator<CreateDiagnosisItemCommand>
{
    public CreateDiagnosisItemCommandValidator()
    {
        RuleFor(x => x.ServiceOrderId)
            .NotEmpty().WithMessage("ServiceOrderId is required");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.Severity)
            .IsInEnum().WithMessage("Severity must be a valid value");
    }
}
