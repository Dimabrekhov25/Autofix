using Autofix.Application.ServiceCatalog.Repositories;
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

    public async Task<IReadOnlyList<ServiceCatalogItem>> GetAllAsync(CancellationToken cancellationToken)
    {
        var items = await dbContext.ServiceCatalogItems
            .AsNoTracking()
            .Where(item => !item.IsDeleted)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);

        return items;
    }
}
