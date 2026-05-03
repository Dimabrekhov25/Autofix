namespace Autofix.Application.ServiceCatalog.Dtos;

/// <summary>
/// Required part line for a catalog item (part identity, name, unit price, quantity).
/// </summary>
public sealed record ServiceCatalogRequiredPartDto(
    Guid PartId,
    string PartName,
    decimal UnitPrice,
    int Quantity
);
