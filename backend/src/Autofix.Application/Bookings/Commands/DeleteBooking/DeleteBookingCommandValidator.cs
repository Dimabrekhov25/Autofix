using FluentValidation;

namespace Autofix.Application.Bookings.Commands.DeleteBooking;

public sealed class DeleteBookingCommandValidator : AbstractValidator<DeleteBookingCommand>
{
    public DeleteBookingCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
