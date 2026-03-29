namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingServiceItemDto(
    Guid Id,
    Guid ServiceCatalogItemId,
    string Name,
    decimal BasePrice,
    TimeSpan EstimatedDuration
);
