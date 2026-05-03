using Autofix.Domain.Entities.Inventory;

namespace Autofix.Application.Common.Interfaces;

/// <summary>Stock lines for parts on hand (inventory).</summary>
public interface IInventoryRepository
{
    /// <summary>Adds an inventory row.</summary>
    Task<InventoryItem> AddAsync(InventoryItem item, CancellationToken cancellationToken);
    /// <summary>Gets by inventory item id.</summary>
    Task<InventoryItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Gets the stock row for a part id, if any.</summary>
    Task<InventoryItem?> GetByPartIdAsync(Guid partId, CancellationToken cancellationToken);
    /// <summary>Lists all inventory items.</summary>
    Task<IReadOnlyList<InventoryItem>> GetAllAsync(CancellationToken cancellationToken);
    /// <summary>Persists quantity or metadata changes.</summary>
    Task UpdateAsync(InventoryItem item, CancellationToken cancellationToken);
    /// <summary>Deletes by id; <c>true</c> if removed.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
