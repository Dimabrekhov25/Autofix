using FluentValidation;

namespace Autofix.Application.Bookings.Commands.CreateBooking;

/// <summary>
/// FluentValidation rules for <see cref="CreateBookingCommand"/> (ids, future start, non-empty service list).
/// </summary>
public sealed class CreateBookingCommandValidator : AbstractValidator<CreateBookingCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
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

        RuleFor(x => x.ServiceCatalogItemIds)
            .NotNull()
            .Must(ids => ids is { Count: > 0 })
            .WithMessage("At least one service must be selected.");

        RuleForEach(x => x.ServiceCatalogItemIds)
            .NotEmpty();
    }
}
