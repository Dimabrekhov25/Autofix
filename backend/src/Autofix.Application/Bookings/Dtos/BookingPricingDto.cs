namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingPricingDto(
    decimal Subtotal,
    decimal EstimatedLaborCost,
    decimal TaxAmount,
    decimal TotalEstimate,
    string Currency
);
