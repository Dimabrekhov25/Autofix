using Autofix.Domain.Entities.Inventory;

namespace Autofix.Application.Common.Interfaces;

public interface IInventoryRepository
{
    Task<InventoryItem> AddAsync(InventoryItem item, CancellationToken cancellationToken);
    Task<InventoryItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<InventoryItem>> GetAllAsync(CancellationToken cancellationToken);
    Task UpdateAsync(InventoryItem item, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
