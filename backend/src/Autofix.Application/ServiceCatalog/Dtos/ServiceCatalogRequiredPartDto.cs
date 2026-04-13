namespace Autofix.Application.ServiceCatalog.Dtos;

public sealed record ServiceCatalogRequiredPartDto(
    Guid PartId,
    string PartName,
    decimal UnitPrice,
    int Quantity
);
