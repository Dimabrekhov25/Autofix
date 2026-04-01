using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingQuoteDto(
    BookingQuoteVehicleDto Vehicle,
    BookingQuoteScheduleDto Schedule,
    BookingPricingDto Pricing,
    IReadOnlyList<BookingQuoteServiceDto> Services,
    IReadOnlyList<BookingPaymentOption> AvailablePaymentOptions
);
