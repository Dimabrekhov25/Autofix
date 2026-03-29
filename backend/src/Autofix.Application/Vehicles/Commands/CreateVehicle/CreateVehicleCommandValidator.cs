using FluentValidation;

namespace Autofix.Application.Vehicles.Commands.CreateVehicle;

public sealed class CreateVehicleCommandValidator : AbstractValidator<CreateVehicleCommand>
{
    public CreateVehicleCommandValidator()
    {
        RuleFor(x => x.OwnerCustomerId)
            .NotEmpty();

        RuleFor(x => x.LicensePlate)
            .NotEmpty()
            .Must(plate => !string.IsNullOrWhiteSpace(plate))
            .WithMessage("License plate must not be empty or whitespace.")
            .MaximumLength(20);

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
    }
}
