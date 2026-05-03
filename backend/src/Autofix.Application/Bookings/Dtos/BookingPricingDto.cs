namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Money breakdown for a booking: catalog subtotal, labor estimate, tax, total, and currency code.
/// </summary>
public sealed record BookingPricingDto(
    decimal Subtotal,
    decimal EstimatedLaborCost,
    decimal TaxAmount,
    decimal TotalEstimate,
    string Currency
);
