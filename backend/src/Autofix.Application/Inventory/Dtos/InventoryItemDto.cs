namespace Autofix.Application.Inventory.Dtos;

public sealed record InventoryItemDto(
    Guid Id,
    Guid PartId,
    int QuantityOnHand,
    int ReservedQuantity,
    int MinLevel
);
