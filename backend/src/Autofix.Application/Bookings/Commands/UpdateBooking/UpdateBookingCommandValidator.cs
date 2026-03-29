using FluentValidation;

namespace Autofix.Application.Bookings.Commands.UpdateBooking;

public sealed class UpdateBookingCommandValidator : AbstractValidator<UpdateBookingCommand>
{
    public UpdateBookingCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.CustomerId)
            .NotEmpty();

        RuleFor(x => x.VehicleId)
            .NotEmpty();

        RuleFor(x => x.StartAt)
            .NotEmpty();

        RuleFor(x => x.EndAt)
            .NotEmpty()
            .GreaterThan(x => x.StartAt)
            .WithMessage("EndAt must be greater than StartAt.");

        RuleForEach(x => x.ServiceCatalogItemIds)
            .NotEmpty();
    }
}
