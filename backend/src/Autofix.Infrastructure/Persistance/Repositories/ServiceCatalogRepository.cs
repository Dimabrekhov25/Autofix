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
            .Include(item => item.RequiredParts.Where(part => !part.IsDeleted))
            .ThenInclude(requirement => requirement.Part)
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
            .Include(item => item.RequiredParts.Where(part => !part.IsDeleted))
            .ThenInclude(requirement => requirement.Part)
            .Where(item => ids.Contains(item.Id) && item.IsActive && !item.IsDeleted)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);

        return items;
    }

    public async Task<IReadOnlyList<ServiceCatalogItem>> GetAllAsync(CancellationToken cancellationToken)
        => await GetAllAsync(isActive: null, ids: null, cancellationToken);

    public async Task<IReadOnlyList<ServiceCatalogItem>> GetAllAsync(
        bool? isActive,
        Guid[]? ids,
        CancellationToken cancellationToken)
    {
        var query = dbContext.ServiceCatalogItems
            .AsNoTracking()
            .Include(item => item.RequiredParts.Where(part => !part.IsDeleted))
            .ThenInclude(requirement => requirement.Part)
            .Where(item => !item.IsDeleted);

        if (isActive.HasValue)
        {
            query = query.Where(item => item.IsActive == isActive.Value);
        }

        if (ids is { Length: > 0 })
        {
            query = query.Where(item => ids.Contains(item.Id));
        }

        return await query
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(ServiceCatalogItem item, CancellationToken cancellationToken)
    {
        var existingItem = await dbContext.ServiceCatalogItems
            .Include(x => x.RequiredParts)
            .FirstOrDefaultAsync(x => x.Id == item.Id && !x.IsDeleted, cancellationToken);

        if (existingItem is null)
        {
            return;
        }

        existingItem.Name = item.Name;
        existingItem.Description = item.Description;
        existingItem.Category = item.Category;
        existingItem.BasePrice = item.BasePrice;
        existingItem.EstimatedLaborCost = item.EstimatedLaborCost;
        existingItem.EstimatedDuration = item.EstimatedDuration;
        existingItem.IsActive = item.IsActive;
        existingItem.UpdatedAt = item.UpdatedAt ?? DateTime.UtcNow;

        var now = DateTime.UtcNow;
        foreach (var requirement in existingItem.RequiredParts.Where(requirement => !requirement.IsDeleted))
        {
            requirement.IsDeleted = true;
            requirement.DeletedAt = now;
            requirement.UpdatedAt = now;
        }

        var newRequirements = item.RequiredParts
            .Select(requirement => new ServiceCatalogPartRequirement
            {
                ServiceCatalogItemId = existingItem.Id,
                PartId = requirement.PartId,
                Quantity = requirement.Quantity
            })
            .ToList();

        if (newRequirements.Count > 0)
        {
            await dbContext.ServiceCatalogPartRequirements.AddRangeAsync(newRequirements, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
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
