using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingServiceItemDto(
    Guid Id,
    Guid ServiceCatalogItemId,
    string Name,
    string Description,
    ServiceCatalogCategory Category,
    decimal BasePrice,
    decimal EstimatedLaborCost,
    TimeSpan EstimatedDuration
);
