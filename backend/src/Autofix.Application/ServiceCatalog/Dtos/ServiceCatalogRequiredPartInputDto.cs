namespace Autofix.Application.ServiceCatalog.Dtos;

/// <summary>
/// Input payload describing a required part and quantity for create/update commands.
/// </summary>
public sealed record ServiceCatalogRequiredPartInputDto(
    Guid PartId,
    int Quantity
);
