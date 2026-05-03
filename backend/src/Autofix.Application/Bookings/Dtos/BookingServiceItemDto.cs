using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// One selected service on a booking, with catalog reference and pricing or duration copied at booking time.
/// </summary>
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
