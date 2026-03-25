using FluentValidation;

namespace Autofix.Application.Vehicles.Queries.GetVehicleById;

public sealed class GetVehicleByIdQueryValidator : AbstractValidator<GetVehicleByIdQuery>
{
    public GetVehicleByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
