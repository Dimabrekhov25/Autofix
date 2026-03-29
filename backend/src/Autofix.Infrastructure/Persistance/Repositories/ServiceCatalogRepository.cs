using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class ServiceCatalogRepository(ApplicationDbContext dbContext) : IServiceCatalogRepository
{
    public async Task<ServiceCatalogItem> AddAsync(ServiceCatalogItem item, CancellationToken cancellationToken)
    {
        dbContext.ServiceCatalogItems.Add(item);
        await dbContext.SaveChangesAsync(cancellationToken);
        return item;
    }

    public Task<ServiceCatalogItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.ServiceCatalogItems
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<ServiceCatalogItem>> GetByIdsAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
        {
            return [];
        }

        var items = await dbContext.ServiceCatalogItems
            .AsNoTracking()
            .Where(item => ids.Contains(item.Id) && item.IsActive && !item.IsDeleted)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);

        return items;
    }

    public async Task<IReadOnlyList<ServiceCatalogItem>> GetAllAsync(CancellationToken cancellationToken)
    {
        var items = await dbContext.ServiceCatalogItems
            .AsNoTracking()
            .Where(item => !item.IsDeleted)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);

        return items;
    }

    public Task UpdateAsync(ServiceCatalogItem item, CancellationToken cancellationToken)
    {
        dbContext.ServiceCatalogItems.Update(item);
        return dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.ServiceCatalogItems
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
