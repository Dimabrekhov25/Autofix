using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.ServiceCatalog.Mapping;

public static class ServiceCatalogItemMapper
{
    public static ServiceCatalogItemDto ToDto(this ServiceCatalogItem entity)
        => new(entity.Id, entity.Name, entity.BasePrice, entity.EstimatedDuration, entity.IsActive);
}
