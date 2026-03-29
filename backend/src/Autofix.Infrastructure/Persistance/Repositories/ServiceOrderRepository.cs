using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.ServiceOrders;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class ServiceOrderRepository(ApplicationDbContext dbContext) : IServiceOrderRepository
{
    public async Task<ServiceOrder> AddAsync(ServiceOrder serviceOrder, CancellationToken cancellationToken)
    {
        dbContext.ServiceOrders.Add(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);
        return serviceOrder;
    }

    public Task<ServiceOrder?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.ServiceOrders
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<ServiceOrder>> GetAllAsync(CancellationToken cancellationToken)
    {
        var serviceOrders = await dbContext.ServiceOrders
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .ToListAsync(cancellationToken);

        return serviceOrders;
    }

    public Task UpdateAsync(ServiceOrder serviceOrder, CancellationToken cancellationToken)
    {
        dbContext.ServiceOrders.Update(serviceOrder);
        return dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var serviceOrder = await dbContext.ServiceOrders
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (serviceOrder is null)
        {
            return false;
        }

        serviceOrder.IsDeleted = true;
        serviceOrder.DeletedAt = DateTime.UtcNow;
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class DiagnosisItemRepository(ApplicationDbContext dbContext) : IDiagnosisItemRepository
{
    public async Task<DiagnosisItem> AddAsync(DiagnosisItem diagnosisItem, CancellationToken cancellationToken)
    {
        dbContext.DiagnosisItems.Add(diagnosisItem);
        await dbContext.SaveChangesAsync(cancellationToken);
        return diagnosisItem;
    }

    public Task<DiagnosisItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.DiagnosisItems
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<DiagnosisItem>> GetAllAsync(CancellationToken cancellationToken)
    {
        var diagnosisItems = await dbContext.DiagnosisItems
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .ToListAsync(cancellationToken);

        return diagnosisItems;
    }

    public Task UpdateAsync(DiagnosisItem diagnosisItem, CancellationToken cancellationToken)
    {
        dbContext.DiagnosisItems.Update(diagnosisItem);
        return dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var diagnosisItem = await dbContext.DiagnosisItems
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (diagnosisItem is null)
        {
            return false;
        }

        diagnosisItem.IsDeleted = true;
        diagnosisItem.DeletedAt = DateTime.UtcNow;
        diagnosisItem.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
