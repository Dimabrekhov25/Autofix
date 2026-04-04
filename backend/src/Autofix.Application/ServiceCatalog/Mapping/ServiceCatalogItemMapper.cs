using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.ServiceCatalog.Mapping;

public static class ServiceCatalogItemMapper
{
    public static ServiceCatalogItemDto ToDto(this ServiceCatalogItem entity)
        => new(
            entity.Id,
            entity.Name,
            entity.Description,
            entity.Category,
            entity.BasePrice,
            entity.EstimatedLaborCost,
            entity.EstimatedDuration,
            entity.IsActive,
            entity.RequiredParts
                .Where(part => !part.IsDeleted && part.Part is not null)
                .OrderBy(part => part.Part!.Name)
                .Select(part => new ServiceCatalogRequiredPartDto(
                    part.PartId,
                    part.Part!.Name,
                    part.Part.UnitPrice,
                    part.Quantity))
                .ToList());
}
