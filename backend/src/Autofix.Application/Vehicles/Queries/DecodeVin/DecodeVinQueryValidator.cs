using FluentValidation;

namespace Autofix.Application.Vehicles.Queries.DecodeVin;

public sealed class DecodeVinQueryValidator : AbstractValidator<DecodeVinQuery>
{
    public DecodeVinQueryValidator()
    {
        RuleFor(x => x.Vin)
            .NotEmpty()
            .Must(vin => !string.IsNullOrWhiteSpace(vin))
            .WithMessage("VIN must not be empty or whitespace.")
            // VIN length is fixed for standard passenger vehicles.
            .Length(17);
    }
}
