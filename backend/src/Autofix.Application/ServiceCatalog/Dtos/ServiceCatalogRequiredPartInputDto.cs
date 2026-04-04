namespace Autofix.Application.ServiceCatalog.Dtos;

public sealed record ServiceCatalogRequiredPartInputDto(
    Guid PartId,
    int Quantity
);
