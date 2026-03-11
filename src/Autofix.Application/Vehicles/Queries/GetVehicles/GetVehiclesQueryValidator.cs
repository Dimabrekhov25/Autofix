using FluentValidation;

namespace Autofix.Application.Vehicles.Queries.GetVehicles;

public sealed class GetVehiclesQueryValidator : AbstractValidator<GetVehiclesQuery>
{
    public GetVehiclesQueryValidator()
    {
        RuleFor(x => x.Page.Page)
            .GreaterThanOrEqualTo(1);

        RuleFor(x => x.Page.PageSize)
            .GreaterThan(0)
            .LessThanOrEqualTo(100);
    }
}
