using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Workshop estimate linked to a booking: service order totals plus projected labor and part lines.
/// </summary>
public sealed record BookingEstimateDto(
    Guid ServiceOrderId,
    ServiceOrderStatus Status,
    decimal EstimatedLaborCost,
    decimal EstimatedPartsCost,
    decimal EstimatedTotalCost,
    IReadOnlyList<BookingEstimateWorkItemDto> WorkItems,
    IReadOnlyList<BookingEstimatePartItemDto> PartItems
);
