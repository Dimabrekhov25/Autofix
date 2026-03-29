using FluentValidation;

namespace Autofix.Application.Diagnosis.Queries.GetDiagnosisItemById;

public sealed class GetDiagnosisItemByIdQueryValidator : AbstractValidator<GetDiagnosisItemByIdQuery>
{
    public GetDiagnosisItemByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");
    }
}
