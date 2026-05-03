using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Part line on an estimate: part reference, quantity, unit price, availability, and line total.
/// </summary>
public sealed record BookingEstimatePartItemDto(
    Guid Id,
    Guid PartId,
    string PartName,
    int Quantity,
    decimal UnitPrice,
    PartAvailability Availability,
    decimal LineTotal
);
