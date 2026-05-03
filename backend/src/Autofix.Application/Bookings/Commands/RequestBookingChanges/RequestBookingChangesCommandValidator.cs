using FluentValidation;

namespace Autofix.Application.Bookings.Commands.RequestBookingChanges;

/// <summary>
/// FluentValidation rules for <see cref="RequestBookingChangesCommand"/>.
/// </summary>
public sealed class RequestBookingChangesCommandValidator : AbstractValidator<RequestBookingChangesCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public RequestBookingChangesCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
