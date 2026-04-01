using FluentValidation;

namespace Autofix.Application.Vehicles.Commands.UpdateVehicle;

public sealed class UpdateVehicleCommandValidator : AbstractValidator<UpdateVehicleCommand>
{
    public UpdateVehicleCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.OwnerCustomerId)
            .NotEmpty();

        RuleFor(x => x.LicensePlate)
            .NotEmpty()
            .Must(plate => !string.IsNullOrWhiteSpace(plate))
            .WithMessage("License plate must not be empty or whitespace.")
            .MaximumLength(20);

        RuleFor(x => x.Vin)
            .NotEmpty()
            .Must(vin => !string.IsNullOrWhiteSpace(vin))
            .WithMessage("VIN must not be empty or whitespace.")
            .Length(17);

        RuleFor(x => x.Make)
            .NotEmpty()
            .Must(make => !string.IsNullOrWhiteSpace(make))
            .WithMessage("Make must not be empty or whitespace.")
            .MaximumLength(100);

        RuleFor(x => x.Model)
            .NotEmpty()
            .Must(model => !string.IsNullOrWhiteSpace(model))
            .WithMessage("Model must not be empty or whitespace.")
            .MaximumLength(100);

        RuleFor(x => x.Year)
            .GreaterThanOrEqualTo(1900)
            .LessThanOrEqualTo(2100);

        RuleFor(x => x.Trim)
            .MaximumLength(100);

        RuleFor(x => x.Engine)
            .MaximumLength(100);
    }
}
