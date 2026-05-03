using FluentValidation;

namespace Autofix.Application.Vehicles.Queries.GetVehicleById;

/// <summary>
/// Validation for <see cref="GetVehicleByIdQuery"/>.
/// </summary>
public sealed class GetVehicleByIdQueryValidator : AbstractValidator<GetVehicleByIdQuery>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public GetVehicleByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
