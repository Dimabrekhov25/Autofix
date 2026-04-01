using Autofix.Application.Inventory.Dtos;
using MediatR;

namespace Autofix.Application.Inventory.Commands.UpdateInventoryItem;

public sealed record UpdateInventoryItemCommand(
    Guid Id,
    Guid PartId,
    int QuantityOnHand,
    int ReservedQuantity,
    int MinLevel
) : IRequest<InventoryItemDto?>;
