using Autofix.Application.Inventory.Dtos;
using Autofix.Domain.Entities.Inventory;

namespace Autofix.Application.Inventory.Mapping;

/// <summary>
/// Maps domain <see cref="InventoryItem"/> to <see cref="InventoryItemDto"/>.
/// </summary>
public static class InventoryItemMapper
{
    /// <summary>Projects entity fields into a DTO.</summary>
    public static InventoryItemDto ToDto(this InventoryItem entity)
        => new(
            entity.Id,
            entity.PartId,
            entity.QuantityOnHand,
            entity.ReservedQuantity,
            entity.MinLevel);
}
