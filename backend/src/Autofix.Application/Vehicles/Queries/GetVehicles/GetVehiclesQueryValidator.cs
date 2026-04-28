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
            // Hard upper bound protects endpoints from excessive page-size requests.
            .LessThanOrEqualTo(100);

        RuleFor(x => x.Vin)
            .MaximumLength(17);
    }
}
