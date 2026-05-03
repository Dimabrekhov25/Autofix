using Autofix.Domain.Enum;
using FluentValidation;

namespace Autofix.Application.Bookings.Commands.UpdateBookingServiceOrderStatus;

/// <summary>
/// FluentValidation rules for <see cref="UpdateBookingServiceOrderStatusCommand"/> (allowed status subset).
/// </summary>
public sealed class UpdateBookingServiceOrderStatusCommandValidator : AbstractValidator<UpdateBookingServiceOrderStatusCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public UpdateBookingServiceOrderStatusCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.Status)
            // Restrict updates to active workflow states; terminal/cancel paths use dedicated commands.
            .Must(status => status is ServiceOrderStatus.Approved or ServiceOrderStatus.InProgress or ServiceOrderStatus.Completed or ServiceOrderStatus.ChangesRequested)
            .WithMessage("Only Approved, InProgress, Completed, or ChangesRequested statuses are supported from active jobs.");
    }
}
