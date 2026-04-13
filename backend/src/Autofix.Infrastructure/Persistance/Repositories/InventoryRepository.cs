using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Inventory;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class InventoryRepository(ApplicationDbContext dbContext) : IInventoryRepository
{
    public async Task<InventoryItem> AddAsync(InventoryItem item, CancellationToken cancellationToken)
    {
        dbContext.InventoryItems.Add(item);
        await dbContext.SaveChangesAsync(cancellationToken);
        return item;
    }

    public Task<InventoryItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.InventoryItems
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);
    }

    public Task<InventoryItem?> GetByPartIdAsync(Guid partId, CancellationToken cancellationToken)
    {
        return dbContext.InventoryItems
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.PartId == partId && !item.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<InventoryItem>> GetAllAsync(CancellationToken cancellationToken)
    {
        var items = await dbContext.InventoryItems
            .AsNoTracking()
            .Where(item => !item.IsDeleted)
            .OrderBy(item => item.PartId)
            .ToListAsync(cancellationToken);

        return items;
    }

    public Task UpdateAsync(InventoryItem item, CancellationToken cancellationToken)
    {
        dbContext.InventoryItems.Update(item);
        return dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.InventoryItems
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (item is null)
        {
            return false;
        }

        item.IsDeleted = true;
        item.DeletedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
