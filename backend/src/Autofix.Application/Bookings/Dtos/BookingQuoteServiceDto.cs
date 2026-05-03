using Autofix.Domain.Enum;
using Autofix.Application.ServiceCatalog.Dtos;

namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Service line inside a quote, including required parts from the catalog definition.
/// </summary>
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
