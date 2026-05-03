using FluentValidation;

namespace Autofix.Application.Bookings.Queries.GetAvailableBookingSlots;

/// <summary>
/// FluentValidation rules for <see cref="GetAvailableBookingSlotsQuery"/>.
/// </summary>
public sealed class GetAvailableBookingSlotsQueryValidator : AbstractValidator<GetAvailableBookingSlotsQuery>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
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
