using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Domain.Entities.ServiceOrders;
using Autofix.Domain.Enum;
using Autofix.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Services;

public sealed class ServiceOrderManagementService(ApplicationDbContext dbContext)
    : IServiceOrderManagementService
{
    private readonly InventoryMutationService inventoryMutationService = new(dbContext);

    public async Task<ServiceOrder> AddCatalogItemsAsync(
        Guid serviceOrderId,
        IReadOnlyList<Guid> serviceCatalogItemIds,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
        EnsureMutable(serviceOrder);

        var normalizedIds = serviceCatalogItemIds
            .Where(id => id != Guid.Empty)
            .Distinct()
            .ToList();

        if (normalizedIds.Count == 0)
        {
            throw new NotFoundException("ServiceCatalogItem", "No services selected");
        }

        var services = await dbContext.ServiceCatalogItems
            .Include(item => item.RequiredParts.Where(part => !part.IsDeleted))
            .ThenInclude(requirement => requirement.Part)
            .Where(item => normalizedIds.Contains(item.Id) && !item.IsDeleted && item.IsActive)
            .ToListAsync(cancellationToken);

        if (services.Count != normalizedIds.Count)
        {
            throw new NotFoundException("ServiceCatalogItem", string.Join(", ", normalizedIds));
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        var workItems = services
            .Select(service => BookingLifecycleService.CreateWorkItem(serviceOrder.Id, service))
            .ToList();

        if (workItems.Count > 0)
        {
            await dbContext.ServiceWorkItems.AddRangeAsync(workItems, cancellationToken);
            serviceOrder.WorkItems.AddRange(workItems);
        }

        var mutations = BookingLifecycleService.AggregateRequiredPartMutations(services);
        await inventoryMutationService.ReserveAsync(
            mutations,
            $"Service order reservation for {serviceOrder.Id}",
            cancellationToken);

        MergePartItems(serviceOrder, mutations);
        BookingLifecycleService.RecalculateTotals(serviceOrder);
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return serviceOrder;
    }

    public async Task<ServiceOrder> AddManualPartAsync(
        Guid serviceOrderId,
        Guid partId,
        int quantity,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
        EnsureMutable(serviceOrder);

        var part = await dbContext.Parts
            .FirstOrDefaultAsync(x => x.Id == partId && !x.IsDeleted && x.IsActive, cancellationToken);

        if (part is null)
        {
            throw new NotFoundException("Part", partId);
        }

        var mutation = new InventoryPartMutation(part.Id, part.Name, part.UnitPrice, quantity);

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        await inventoryMutationService.ReserveAsync([mutation], $"Manual part reservation for {serviceOrder.Id}", cancellationToken);

        MergePartItems(serviceOrder, [mutation]);
        BookingLifecycleService.RecalculateTotals(serviceOrder);
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return serviceOrder;
    }

    public async Task<ServiceOrder?> RemovePartItemAsync(
        Guid serviceOrderId,
        Guid partItemId,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
        EnsureMutable(serviceOrder);

        var partItem = serviceOrder.PartItems.FirstOrDefault(item => item.Id == partItemId && !item.IsDeleted);
        if (partItem is null)
        {
            return null;
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        await inventoryMutationService.ReleaseAsync(
            [new InventoryPartMutation(partItem.PartId, partItem.PartName, partItem.UnitPrice, partItem.Quantity)],
            $"Service order part release for {serviceOrder.Id}",
            cancellationToken);

        var now = DateTime.UtcNow;
        partItem.IsDeleted = true;
        partItem.DeletedAt = now;
        partItem.UpdatedAt = now;
        serviceOrder.UpdatedAt = now;

        BookingLifecycleService.RecalculateTotals(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return serviceOrder;
    }

    public async Task<ServiceOrder?> UpdateStatusAsync(
        Guid serviceOrderId,
        ServiceOrderStatus status,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);

        if (serviceOrder.Status == ServiceOrderStatus.Completed && status != ServiceOrderStatus.Completed)
        {
            throw new BadRequestException("Completed service orders cannot be reopened.");
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        if (status == ServiceOrderStatus.Completed && serviceOrder.Status != ServiceOrderStatus.Completed)
        {
            await inventoryMutationService.ConsumeReservedAsync(
                serviceOrder.PartItems
                    .Where(item => !item.IsDeleted)
                    .Select(item => new InventoryPartMutation(item.PartId, item.PartName, item.UnitPrice, item.Quantity))
                    .ToList(),
                $"Service order completion for {serviceOrder.Id}",
                cancellationToken);
        }

        serviceOrder.Status = status;
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return serviceOrder;
    }

    private async Task<ServiceOrder> LoadTrackedServiceOrderAsync(Guid serviceOrderId, CancellationToken cancellationToken)
    {
        var serviceOrder = await dbContext.ServiceOrders
            .Include(x => x.WorkItems)
            .Include(x => x.PartItems)
            .FirstOrDefaultAsync(x => x.Id == serviceOrderId && !x.IsDeleted, cancellationToken);

        return serviceOrder ?? throw new NotFoundException("ServiceOrder", serviceOrderId);
    }

    private static void EnsureMutable(ServiceOrder serviceOrder)
    {
        if (serviceOrder.Status == ServiceOrderStatus.Completed)
        {
            throw new BadRequestException("Completed service orders cannot be modified.");
        }
    }

    private static void MergePartItems(ServiceOrder serviceOrder, IReadOnlyCollection<InventoryPartMutation> mutations)
    {
        foreach (var mutation in mutations)
        {
            var existingItem = serviceOrder.PartItems
                .FirstOrDefault(item => !item.IsDeleted && item.PartId == mutation.PartId && item.UnitPrice == mutation.UnitPrice);

            if (existingItem is null)
            {
                serviceOrder.PartItems.Add(new ServicePartItem
                {
                    ServiceOrderId = serviceOrder.Id,
                    PartId = mutation.PartId,
                    PartName = mutation.PartName,
                    Quantity = mutation.Quantity,
                    UnitPrice = mutation.UnitPrice,
                    Availability = PartAvailability.InStock,
                    IsApproved = false
                });

                continue;
            }

            existingItem.Quantity += mutation.Quantity;
            existingItem.UpdatedAt = DateTime.UtcNow;
        }
    }
}
