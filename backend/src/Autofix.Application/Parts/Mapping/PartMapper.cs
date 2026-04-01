using Autofix.Application.Parts.Dtos;
using Autofix.Domain.Entities.Inventory;

namespace Autofix.Application.Parts.Mapping;

public static class PartMapper
{
    public static PartDto ToDto(this Part entity)
        => new(entity.Id, entity.Name, entity.UnitPrice, entity.IsActive);
}
