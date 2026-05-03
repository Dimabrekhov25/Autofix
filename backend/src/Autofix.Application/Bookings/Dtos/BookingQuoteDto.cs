using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Pre-commit quote: vehicle, proposed schedule, pricing, chosen services, and payment options the customer may use.
/// </summary>
public sealed record BookingQuoteDto(
    BookingQuoteVehicleDto Vehicle,
    BookingQuoteScheduleDto Schedule,
    BookingPricingDto Pricing,
    IReadOnlyList<BookingQuoteServiceDto> Services,
    IReadOnlyList<BookingPaymentOption> AvailablePaymentOptions
);
