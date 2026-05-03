using Autofix.Application.Common.Interfaces;
using Autofix.Application.Inventory.Dtos;
using Autofix.Application.Inventory.Mapping;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Inventory.Commands.UpdateInventoryItem;

/// <summary>
/// Loads an inventory item, validates the part, applies changes, and persists.
/// </summary>
public sealed class UpdateInventoryItemHandler(
    IInventoryRepository inventoryRepository,
    IPartRepository partRepository)
    : IRequestHandler<UpdateInventoryItemCommand, InventoryItemDto?>
{
    /// <inheritdoc />
    public async Task<InventoryItemDto?> Handle(UpdateInventoryItemCommand request, CancellationToken cancellationToken)
    {
        var item = await inventoryRepository.GetByIdAsync(request.Id, cancellationToken);
        if (item is null)
        {
            return null;
        }

        var part = await partRepository.GetByIdAsync(request.PartId, cancellationToken);
        if (part is null)
        {
            throw new NotFoundException("Part", request.PartId);
        }

        item.PartId = request.PartId;
        item.QuantityOnHand = request.QuantityOnHand;
        item.ReservedQuantity = request.ReservedQuantity;
        item.MinLevel = request.MinLevel;
        item.UpdatedAt = DateTime.UtcNow;

        await inventoryRepository.UpdateAsync(item, cancellationToken);
        return item.ToDto();
    }
}
