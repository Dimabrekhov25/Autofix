namespace Autofix.Application.Inventory.Dtos;

/// <summary>
/// Inventory read model (part link, on-hand quantity, reservations, and minimum level).
/// </summary>
public sealed record InventoryItemDto(
    Guid Id,
    Guid PartId,
    int QuantityOnHand,
    int ReservedQuantity,
    int MinLevel
);
