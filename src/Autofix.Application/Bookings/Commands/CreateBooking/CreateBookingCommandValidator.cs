using FluentValidation;

namespace Autofix.Application.Bookings.Commands.CreateBooking;

public sealed class CreateBookingCommandValidator : AbstractValidator<CreateBookingCommand>
{
    public CreateBookingCommandValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty();

        RuleFor(x => x.VehicleId)
            .NotEmpty();

        RuleFor(x => x.StartAt)
            .NotEmpty()
            .Must(startAt => startAt > DateTime.UtcNow)
            .WithMessage("StartAt must be in the future.");

        RuleFor(x => x.EndAt)
            .NotEmpty()
            .GreaterThan(x => x.StartAt)
            .WithMessage("EndAt must be greater than StartAt.");

        RuleForEach(x => x.ServiceCatalogItemIds)
            .NotEmpty();
    }
}
