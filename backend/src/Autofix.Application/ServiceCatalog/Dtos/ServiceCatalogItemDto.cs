using Autofix.Domain.Enum;

namespace Autofix.Application.ServiceCatalog.Dtos;

public sealed record ServiceCatalogItemDto(
    Guid Id,
    string Name,
    string Description,
    ServiceCatalogCategory Category,
    decimal BasePrice,
    decimal EstimatedLaborCost,
    TimeSpan EstimatedDuration,
    bool IsActive
);
