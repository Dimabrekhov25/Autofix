using FluentValidation;

namespace Autofix.Application.Bookings.Commands.RequestBookingChanges;

public sealed class RequestBookingChangesCommandValidator : AbstractValidator<RequestBookingChangesCommand>
{
    public RequestBookingChangesCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
