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
            .Must(status => status is ServiceOrderStatus.InProgress or ServiceOrderStatus.Completed)
            .WithMessage("Only InProgress or Completed statuses are supported from active jobs.");
    }
}
