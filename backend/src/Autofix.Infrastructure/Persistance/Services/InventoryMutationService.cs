using Autofix.Domain.Entities.Inventory;
using Autofix.Domain.Exceptions;
using Autofix.Domain.Enum;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Services;

internal sealed class InventoryMutationService(ApplicationDbContext dbContext)
{
    public async Task ReserveAsync(
        IReadOnlyCollection<InventoryPartMutation> mutations,
        string reason,
        CancellationToken cancellationToken)
    {
        if (mutations.Count == 0)
        {
            return;
        }

        var inventoryByPartId = await LoadInventoryByPartIdAsync(mutations, cancellationToken);
        var now = DateTime.UtcNow;

        foreach (var mutation in mutations)
        {
            if (!inventoryByPartId.TryGetValue(mutation.PartId, out var inventoryItem))
            {
                throw new ConflictException(
                    $"Required part '{mutation.PartName}' is not configured in inventory. Create an inventory item before reserving this service.");
            }

            var availableQuantity = inventoryItem.QuantityOnHand - inventoryItem.ReservedQuantity;
            if (availableQuantity < mutation.Quantity)
            {
                throw new ConflictException(
                    $"Insufficient stock for part '{mutation.PartName}'. Requested {mutation.Quantity}, available {availableQuantity}.");
            }

            inventoryItem.ReservedQuantity += mutation.Quantity;
            inventoryItem.UpdatedAt = now;

            dbContext.InventoryMovements.Add(new InventoryMovement
            {
                PartId = mutation.PartId,
                MovementType = InventoryMovementType.Reservation,
                Quantity = mutation.Quantity,
                Reason = reason,
                OccurredAt = now
            });
        }
    }

    public async Task ReleaseAsync(
        IReadOnlyCollection<InventoryPartMutation> mutations,
        string reason,
        CancellationToken cancellationToken)
    {
        if (mutations.Count == 0)
        {
            return;
        }

        var inventoryByPartId = await LoadInventoryByPartIdAsync(mutations, cancellationToken);
        var now = DateTime.UtcNow;

        foreach (var mutation in mutations)
        {
            if (!inventoryByPartId.TryGetValue(mutation.PartId, out var inventoryItem))
            {
                throw new ConflictException(
                    $"Required part '{mutation.PartName}' is not configured in inventory, so the reservation cannot be released cleanly.");
            }

            if (inventoryItem.ReservedQuantity < mutation.Quantity)
            {
                throw new ConflictException(
                    $"Cannot release {mutation.Quantity} reserved units for part '{mutation.PartName}'. Only {inventoryItem.ReservedQuantity} reserved.");
            }

            inventoryItem.ReservedQuantity -= mutation.Quantity;
            inventoryItem.UpdatedAt = now;

            dbContext.InventoryMovements.Add(new InventoryMovement
            {
                PartId = mutation.PartId,
                MovementType = InventoryMovementType.Release,
                Quantity = mutation.Quantity,
                Reason = reason,
                OccurredAt = now
            });
        }
    }

    public async Task ConsumeReservedAsync(
        IReadOnlyCollection<InventoryPartMutation> mutations,
        string reason,
        CancellationToken cancellationToken)
    {
        if (mutations.Count == 0)
        {
            return;
        }

        var inventoryByPartId = await LoadInventoryByPartIdAsync(mutations, cancellationToken);
        var now = DateTime.UtcNow;

        foreach (var mutation in mutations)
        {
            if (!inventoryByPartId.TryGetValue(mutation.PartId, out var inventoryItem))
            {
                throw new ConflictException(
                    $"Required part '{mutation.PartName}' is not configured in inventory, so the reserved stock cannot be consumed.");
            }

            if (inventoryItem.ReservedQuantity < mutation.Quantity)
            {
                throw new ConflictException(
                    $"Cannot consume {mutation.Quantity} reserved units for part '{mutation.PartName}'. Only {inventoryItem.ReservedQuantity} reserved.");
            }

            if (inventoryItem.QuantityOnHand < mutation.Quantity)
            {
                throw new ConflictException(
                    $"Cannot consume {mutation.Quantity} units for part '{mutation.PartName}'. Only {inventoryItem.QuantityOnHand} on hand.");
            }

            inventoryItem.ReservedQuantity -= mutation.Quantity;
            inventoryItem.QuantityOnHand -= mutation.Quantity;
            inventoryItem.UpdatedAt = now;

            dbContext.InventoryMovements.Add(new InventoryMovement
            {
                PartId = mutation.PartId,
                MovementType = InventoryMovementType.Outbound,
                Quantity = mutation.Quantity,
                Reason = reason,
                OccurredAt = now
            });
        }
    }

    private async Task<Dictionary<Guid, InventoryItem>> LoadInventoryByPartIdAsync(
        IReadOnlyCollection<InventoryPartMutation> mutations,
        CancellationToken cancellationToken)
    {
        var partIds = mutations
            .Select(mutation => mutation.PartId)
            .Distinct()
            .ToList();

        return await dbContext.InventoryItems
            .Where(item => partIds.Contains(item.PartId) && !item.IsDeleted)
            .ToDictionaryAsync(item => item.PartId, cancellationToken);
    }
}

internal sealed record InventoryPartMutation(
    Guid PartId,
    string PartName,
    decimal UnitPrice,
    int Quantity
);
