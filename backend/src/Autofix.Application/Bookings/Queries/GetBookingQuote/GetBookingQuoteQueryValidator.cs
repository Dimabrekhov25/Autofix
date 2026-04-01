using FluentValidation;

namespace Autofix.Application.Bookings.Queries.GetBookingQuote;

public sealed class GetBookingQuoteQueryValidator : AbstractValidator<GetBookingQuoteQuery>
{
    public GetBookingQuoteQueryValidator()
    {
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
