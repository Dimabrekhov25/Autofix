using FluentValidation;

namespace Autofix.Application.Bookings.Commands.ApproveBookingEstimate;

/// <summary>
/// FluentValidation rules for <see cref="ApproveBookingEstimateCommand"/>.
/// </summary>
public sealed class ApproveBookingEstimateCommandValidator : AbstractValidator<ApproveBookingEstimateCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public ApproveBookingEstimateCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
