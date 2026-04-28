using Autofix.Domain.Enum;
using FluentValidation;

namespace Autofix.Application.Bookings.Commands.UpdateBookingServiceOrderStatus;

public sealed class UpdateBookingServiceOrderStatusCommandValidator : AbstractValidator<UpdateBookingServiceOrderStatusCommand>
{
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
