using Autofix.Domain.Enum;
using Autofix.Application.ServiceCatalog.Dtos;

namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingQuoteServiceDto(
    Guid ServiceCatalogItemId,
    string Name,
    string Description,
    ServiceCatalogCategory Category,
    decimal BasePrice,
    decimal EstimatedLaborCost,
    TimeSpan EstimatedDuration,
    IReadOnlyList<ServiceCatalogRequiredPartDto> RequiredParts
);
