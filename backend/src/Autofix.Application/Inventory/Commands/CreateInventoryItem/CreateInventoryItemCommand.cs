using Autofix.Application.Inventory.Dtos;
using MediatR;

namespace Autofix.Application.Inventory.Commands.CreateInventoryItem;

/// <summary>
/// Creates an inventory row for a part with stock and reservation levels.
/// </summary>
public sealed record CreateInventoryItemCommand(
    Guid PartId,
    int QuantityOnHand,
    int ReservedQuantity,
    int MinLevel
) : IRequest<InventoryItemDto>;
