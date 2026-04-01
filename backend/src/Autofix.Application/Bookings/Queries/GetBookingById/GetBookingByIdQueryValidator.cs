using FluentValidation;

namespace Autofix.Application.Bookings.Queries.GetBookingById;

public sealed class GetBookingByIdQueryValidator : AbstractValidator<GetBookingByIdQuery>
{
    public GetBookingByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
