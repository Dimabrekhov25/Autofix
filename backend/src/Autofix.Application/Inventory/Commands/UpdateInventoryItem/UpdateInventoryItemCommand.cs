using Autofix.Application.Inventory.Dtos;
using MediatR;

namespace Autofix.Application.Inventory.Commands.UpdateInventoryItem;

/// <summary>
/// Updates quantities, part link, and minimum level for an inventory item.
/// </summary>
public sealed record UpdateInventoryItemCommand(
    Guid Id,
    Guid PartId,
    int QuantityOnHand,
    int ReservedQuantity,
    int MinLevel
) : IRequest<InventoryItemDto?>;
