using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingEstimatePartItemDto(
    Guid Id,
    Guid PartId,
    string PartName,
    int Quantity,
    decimal UnitPrice,
    PartAvailability Availability,
    decimal LineTotal
);
