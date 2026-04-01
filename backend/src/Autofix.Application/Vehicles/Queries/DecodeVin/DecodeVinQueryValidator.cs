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
            .Length(17);
    }
}
