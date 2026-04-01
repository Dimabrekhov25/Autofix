using Autofix.Application.Inventory.Dtos;
using MediatR;

namespace Autofix.Application.Inventory.Commands.CreateInventoryItem;

public sealed record CreateInventoryItemCommand(
    Guid PartId,
    int QuantityOnHand,
    int ReservedQuantity,
    int MinLevel
) : IRequest<InventoryItemDto>;
