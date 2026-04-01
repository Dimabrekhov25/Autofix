using Autofix.Application.Inventory.Dtos;
using Autofix.Domain.Entities.Inventory;

namespace Autofix.Application.Inventory.Mapping;

public static class InventoryItemMapper
{
    public static InventoryItemDto ToDto(this InventoryItem entity)
        => new(
            entity.Id,
            entity.PartId,
            entity.QuantityOnHand,
            entity.ReservedQuantity,
            entity.MinLevel);
}
