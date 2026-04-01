using FluentValidation;

namespace Autofix.Application.Bookings.Queries.GetAvailableBookingSlots;

public sealed class GetAvailableBookingSlotsQueryValidator : AbstractValidator<GetAvailableBookingSlotsQuery>
{
    public GetAvailableBookingSlotsQueryValidator()
    {
        RuleFor(x => x.Date)
            .NotEmpty();

        RuleFor(x => x.ServiceCatalogItemIds)
            .NotNull()
            .Must(ids => ids is { Count: > 0 })
            .WithMessage("At least one service must be selected.");

        RuleForEach(x => x.ServiceCatalogItemIds)
            .NotEmpty();
    }
}
