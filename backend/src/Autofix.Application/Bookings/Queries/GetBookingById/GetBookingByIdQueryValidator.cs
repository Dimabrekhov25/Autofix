using FluentValidation;

namespace Autofix.Application.Bookings.Queries.GetBookingById;

/// <summary>
/// FluentValidation rules for <see cref="GetBookingByIdQuery"/>.
/// </summary>
public sealed class GetBookingByIdQueryValidator : AbstractValidator<GetBookingByIdQuery>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public GetBookingByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
