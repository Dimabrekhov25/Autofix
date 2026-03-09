namespace Autofix.Application.ServiceCatalog.Dtos;

public sealed record ServiceCatalogItemDto(
    Guid Id,
    string Name,
    decimal BasePrice,
    TimeSpan EstimatedDuration,
    bool IsActive
);
