using FluentValidation;

namespace Autofix.Application.Bookings.Queries.GetBookingQuote;

/// <summary>
/// FluentValidation rules for <see cref="GetBookingQuoteQuery"/>.
/// </summary>
public sealed class GetBookingQuoteQueryValidator : AbstractValidator<GetBookingQuoteQuery>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public GetBookingQuoteQueryValidator()
    {
        RuleFor(x => x.VehicleId)
            .NotEmpty();

        RuleFor(x => x.StartAt)
            .NotEmpty()
            // Quote endpoint only supports future bookings; past timestamps are invalid input.
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
