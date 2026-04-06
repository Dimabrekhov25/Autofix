using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingEstimateDto(
    Guid ServiceOrderId,
    ServiceOrderStatus Status,
    decimal EstimatedLaborCost,
    decimal EstimatedPartsCost,
    decimal EstimatedTotalCost,
    IReadOnlyList<BookingEstimateWorkItemDto> WorkItems,
    IReadOnlyList<BookingEstimatePartItemDto> PartItems
);
