using FluentValidation;

namespace Autofix.Application.Bookings.Commands.DeleteBooking;

/// <summary>
/// FluentValidation rules for <see cref="DeleteBookingCommand"/>.
/// </summary>
public sealed class DeleteBookingCommandValidator : AbstractValidator<DeleteBookingCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public DeleteBookingCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
