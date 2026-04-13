using FluentValidation;

namespace Autofix.Application.Bookings.Commands.ApproveBookingEstimate;

public sealed class ApproveBookingEstimateCommandValidator : AbstractValidator<ApproveBookingEstimateCommand>
{
    public ApproveBookingEstimateCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
