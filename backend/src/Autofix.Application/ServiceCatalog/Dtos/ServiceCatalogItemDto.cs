using Autofix.Domain.Enum;

namespace Autofix.Application.ServiceCatalog.Dtos;

/// <summary>
/// Service catalog read model including economics, duration, category, and required parts.
/// </summary>
public sealed record ServiceCatalogItemDto(
    Guid Id,
    string Name,
    string Description,
    ServiceCatalogCategory Category,
    decimal BasePrice,
    decimal EstimatedLaborCost,
    TimeSpan EstimatedDuration,
    bool IsActive,
    IReadOnlyList<ServiceCatalogRequiredPartDto> RequiredParts
);
