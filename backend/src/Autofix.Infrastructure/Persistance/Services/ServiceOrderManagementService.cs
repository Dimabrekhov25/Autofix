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
        EnsureEstimateEditable(serviceOrder);

        var normalizedIds = serviceCatalogItemIds
            .Where(id => id != Guid.Empty)
            .Distinct()
            .ToList();

        if (normalizedIds.Count == 0)
        {
            throw new NotFoundException("ServiceCatalogItem", "No services selected");
        }

        var services = await dbContext.ServiceCatalogItems
            .Where(item => normalizedIds.Contains(item.Id) && !item.IsDeleted && item.IsActive)
            .ToListAsync(cancellationToken);

        if (services.Count != normalizedIds.Count)
        {
            throw new NotFoundException("ServiceCatalogItem", string.Join(", ", normalizedIds));
        }

        var existingDescriptions = serviceOrder.WorkItems
            .Where(item => !item.IsDeleted)
            .Select(item => item.Description.Trim())
            .Where(description => !string.IsNullOrWhiteSpace(description))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var workItems = services
            .Where(service => !existingDescriptions.Contains(service.Name.Trim()))
            .Select(service => BookingLifecycleService.CreateWorkItem(serviceOrder.Id, service))
            .ToList();

        if (workItems.Count > 0)
        {
            await dbContext.ServiceWorkItems.AddRangeAsync(workItems, cancellationToken);
        }

        BookingLifecycleService.RecalculateTotals(serviceOrder);
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return serviceOrder;
    }

    public async Task<ServiceOrder> AddManualPartAsync(
        Guid serviceOrderId,
        Guid partId,
        int quantity,
        CancellationToken cancellationToken)
    {
        try
        {
            return await AddManualPartInternalAsync(serviceOrderId, partId, quantity, cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            dbContext.ChangeTracker.Clear();
            return await AddManualPartInternalAsync(serviceOrderId, partId, quantity, cancellationToken);
        }
    }

    public async Task<ServiceOrder?> RemovePartItemAsync(
        Guid serviceOrderId,
        Guid partItemId,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
        EnsureEstimateEditable(serviceOrder);

        var partItem = serviceOrder.PartItems.FirstOrDefault(item => item.Id == partItemId && !item.IsDeleted);
        if (partItem is null)
        {
            return null;
        }

        SoftDeleteEntity(partItem);
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        BookingLifecycleService.RecalculateTotals(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);

        return serviceOrder;
    }

    public async Task<ServiceOrder?> RemoveWorkItemAsync(
        Guid serviceOrderId,
        Guid workItemId,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
        EnsureEstimateEditable(serviceOrder);

        var workItem = serviceOrder.WorkItems.FirstOrDefault(item => item.Id == workItemId && !item.IsDeleted);
        if (workItem is null)
        {
            return null;
        }

        SoftDeleteEntity(workItem);
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        BookingLifecycleService.RecalculateTotals(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);

        return serviceOrder;
    }

    public async Task<ServiceOrder?> UpdateWorkItemAsync(
        Guid serviceOrderId,
        Guid workItemId,
        decimal laborHours,
        decimal hourlyRate,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
        EnsureEstimateEditable(serviceOrder);

        var workItem = serviceOrder.WorkItems.FirstOrDefault(item => item.Id == workItemId && !item.IsDeleted);
        if (workItem is null)
        {
            return null;
        }

        var servicePrice = decimal.Round(laborHours * hourlyRate, 2, MidpointRounding.AwayFromZero);
        var minimumPrice = await GetMinimumServicePriceAsync(workItem.Description, cancellationToken);

        if (servicePrice < minimumPrice)
        {
            throw new BadRequestException($"Service price cannot be lower than the starting price of {minimumPrice:F2}.");
        }

        workItem.LaborHours = 1m;
        workItem.HourlyRate = servicePrice;
        workItem.UpdatedAt = DateTime.UtcNow;
        serviceOrder.UpdatedAt = workItem.UpdatedAt;

        BookingLifecycleService.RecalculateTotals(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);

        return serviceOrder;
    }

    public async Task<ServiceOrder?> UpdateStatusAsync(
        Guid serviceOrderId,
        ServiceOrderStatus status,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
        return await UpdateStatusInternalAsync(serviceOrder, status, cancellationToken);
    }

    public async Task<ServiceOrder?> UpdateStatusByBookingIdAsync(
        Guid bookingId,
        ServiceOrderStatus status,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await dbContext.ServiceOrders
            .Include(x => x.WorkItems)
            .Include(x => x.PartItems)
            .Include(x => x.Booking)
            .FirstOrDefaultAsync(x => x.BookingId == bookingId && !x.IsDeleted, cancellationToken);

        if (serviceOrder is null)
        {
            return null;
        }

        return await UpdateStatusInternalAsync(serviceOrder, status, cancellationToken);
    }

    public async Task<ServiceOrder?> ApproveByCustomerAsync(
        Guid bookingId,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await dbContext.ServiceOrders
            .Include(x => x.WorkItems)
            .Include(x => x.PartItems)
            .Include(x => x.Booking)
            .FirstOrDefaultAsync(x => x.BookingId == bookingId && !x.IsDeleted, cancellationToken);

        if (serviceOrder is null)
        {
            return null;
        }

        return await UpdateStatusInternalAsync(
            serviceOrder,
            ServiceOrderStatus.Approved,
            cancellationToken,
            markCustomerApproval: true);
    }

    private async Task<ServiceOrder?> UpdateStatusInternalAsync(
        ServiceOrder serviceOrder,
        ServiceOrderStatus targetStatus,
        CancellationToken cancellationToken,
        bool markCustomerApproval = false)
    {
        ValidateStatusTransition(serviceOrder.Status, targetStatus);

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        var mutations = serviceOrder.PartItems
            .Where(item => !item.IsDeleted)
            .Select(item => new InventoryPartMutation(item.PartId, item.PartName, item.UnitPrice, item.Quantity))
            .ToList();

        var currentConsumesInventory = ConsumesInventory(serviceOrder.Status);
        var targetConsumesInventory = ConsumesInventory(targetStatus);

        if (!currentConsumesInventory && targetConsumesInventory)
        {
            await inventoryMutationService.ConsumeAvailableAsync(
                mutations,
                $"Service order {serviceOrder.Id} moved to {targetStatus}",
                cancellationToken);
        }

        if (currentConsumesInventory && !targetConsumesInventory)
        {
            await inventoryMutationService.RestoreAvailableAsync(
                mutations,
                $"Service order {serviceOrder.Id} reverted to {targetStatus}",
                cancellationToken);
        }

        serviceOrder.Status = targetStatus;
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        if (markCustomerApproval)
        {
            serviceOrder.CustomerApprovedAt = serviceOrder.UpdatedAt;
            serviceOrder.CustomerApprovalNotificationReadAt = null;
        }

        var booking = serviceOrder.Booking
            ?? await dbContext.Bookings.FirstOrDefaultAsync(x => x.Id == serviceOrder.BookingId && !x.IsDeleted, cancellationToken)
            ?? throw new NotFoundException("Booking", serviceOrder.BookingId);

        booking.Status = BookingLifecycleService.MapServiceOrderStatus(targetStatus);
        booking.UpdatedAt = serviceOrder.UpdatedAt;

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return serviceOrder;
    }

    private async Task<ServiceOrder> LoadTrackedServiceOrderAsync(Guid serviceOrderId, CancellationToken cancellationToken)
    {
        var serviceOrder = await dbContext.ServiceOrders
            .Include(x => x.Booking)
            .Include(x => x.WorkItems.Where(item => !item.IsDeleted))
            .Include(x => x.PartItems.Where(item => !item.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == serviceOrderId && !x.IsDeleted, cancellationToken);

        return serviceOrder ?? throw new NotFoundException("ServiceOrder", serviceOrderId);
    }

    private async Task<ServiceOrder> AddManualPartInternalAsync(
        Guid serviceOrderId,
        Guid partId,
        int quantity,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
        EnsureEstimateEditable(serviceOrder);

        var inventoryItem = await dbContext.InventoryItems
            .Include(x => x.Part)
            .FirstOrDefaultAsync(
                x => x.PartId == partId && !x.IsDeleted && x.Part != null && !x.Part.IsDeleted && x.Part.IsActive,
                cancellationToken);

        if (inventoryItem?.Part is null)
        {
            throw new ConflictException("Selected part is not configured in inventory.");
        }

        var availability = inventoryItem.QuantityOnHand >= quantity
            ? PartAvailability.InStock
            : PartAvailability.BackOrder;

        var existingItem = serviceOrder.PartItems
            .FirstOrDefault(item => item.PartId == partId && item.UnitPrice == inventoryItem.Part.UnitPrice);

        ServicePartItem? newPartItem = null;
        if (existingItem is null)
        {
            newPartItem = new ServicePartItem
            {
                ServiceOrderId = serviceOrder.Id,
                PartId = partId,
                PartName = inventoryItem.Part.Name,
                Quantity = quantity,
                UnitPrice = inventoryItem.Part.UnitPrice,
                Availability = availability,
                IsApproved = false
            };

            await dbContext.ServicePartItems.AddAsync(newPartItem, cancellationToken);
        }
        else
        {
            existingItem.Quantity += quantity;
            existingItem.Availability = availability;
            existingItem.UpdatedAt = DateTime.UtcNow;
        }

        RecalculateTotals(serviceOrder, newPartItem);
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        dbContext.ChangeTracker.Clear();
        return await LoadTrackedServiceOrderAsync(serviceOrderId, cancellationToken);
    }

    private async Task<decimal> GetMinimumServicePriceAsync(string workItemDescription, CancellationToken cancellationToken)
    {
        var normalizedDescription = workItemDescription.Trim();
        if (string.IsNullOrWhiteSpace(normalizedDescription))
        {
            return 0m;
        }

        var minimumPrice = await dbContext.ServiceCatalogItems
            .Where(item => !item.IsDeleted && item.IsActive && item.Name == normalizedDescription)
            .Select(item => item.BasePrice)
            .FirstOrDefaultAsync(cancellationToken);

        return minimumPrice < 0m ? 0m : minimumPrice;
    }

    private static void EnsureEstimateEditable(ServiceOrder serviceOrder)
    {
        if (serviceOrder.Status is ServiceOrderStatus.AwaitingApproval or ServiceOrderStatus.Approved or ServiceOrderStatus.InProgress or ServiceOrderStatus.Completed or ServiceOrderStatus.Cancelled)
        {
            throw new BadRequestException("This service order can no longer be edited.");
        }
    }

    private static void ValidateStatusTransition(ServiceOrderStatus currentStatus, ServiceOrderStatus targetStatus)
    {
        if (currentStatus == targetStatus)
        {
            return;
        }

        if (currentStatus == ServiceOrderStatus.Cancelled)
        {
            throw new BadRequestException("Cancelled service orders cannot be reopened.");
        }

        var isValid = (currentStatus, targetStatus) switch
        {
            (ServiceOrderStatus.Pending, ServiceOrderStatus.AwaitingApproval) => true,
            (ServiceOrderStatus.Pending, ServiceOrderStatus.Cancelled) => true,
            (ServiceOrderStatus.AwaitingApproval, ServiceOrderStatus.Approved) => true,
            (ServiceOrderStatus.AwaitingApproval, ServiceOrderStatus.ChangesRequested) => true,
            (ServiceOrderStatus.AwaitingApproval, ServiceOrderStatus.Cancelled) => true,
            (ServiceOrderStatus.ChangesRequested, ServiceOrderStatus.Pending) => true,
            (ServiceOrderStatus.ChangesRequested, ServiceOrderStatus.AwaitingApproval) => true,
            (ServiceOrderStatus.ChangesRequested, ServiceOrderStatus.Cancelled) => true,
            (ServiceOrderStatus.Approved, ServiceOrderStatus.ChangesRequested) => true,
            (ServiceOrderStatus.Approved, ServiceOrderStatus.InProgress) => true,
            (ServiceOrderStatus.Approved, ServiceOrderStatus.Completed) => true,
            (ServiceOrderStatus.Approved, ServiceOrderStatus.Cancelled) => true,
            (ServiceOrderStatus.InProgress, ServiceOrderStatus.ChangesRequested) => true,
            (ServiceOrderStatus.InProgress, ServiceOrderStatus.Approved) => true,
            (ServiceOrderStatus.InProgress, ServiceOrderStatus.Completed) => true,
            (ServiceOrderStatus.Completed, ServiceOrderStatus.ChangesRequested) => true,
            (ServiceOrderStatus.Completed, ServiceOrderStatus.InProgress) => true,
            (ServiceOrderStatus.Completed, ServiceOrderStatus.Approved) => true,
            _ => false
        };

        if (!isValid)
        {
            throw new BadRequestException($"Invalid service order status transition from {currentStatus} to {targetStatus}.");
        }
    }

    private static bool ConsumesInventory(ServiceOrderStatus status)
        => status is ServiceOrderStatus.InProgress or ServiceOrderStatus.Completed;

    private static void MergePartItems(ServiceOrder serviceOrder, IReadOnlyCollection<ServicePartMutation> mutations)
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
                    Availability = mutation.Availability,
                    IsApproved = false
                });

                continue;
            }

            existingItem.Quantity += mutation.Quantity;
            existingItem.Availability = mutation.Availability;
            existingItem.UpdatedAt = DateTime.UtcNow;
        }
    }

    private static void RecalculateTotals(ServiceOrder serviceOrder, ServicePartItem? pendingPartItem = null)
    {
        var laborCost = serviceOrder.WorkItems
            .Where(item => !item.IsDeleted)
            .Sum(item => item.LaborHours * item.HourlyRate);

        var partItems = serviceOrder.PartItems
            .Where(item => !item.IsDeleted)
            .ToList();

        if (pendingPartItem is not null)
        {
            partItems.Add(pendingPartItem);
        }

        serviceOrder.EstimatedLaborCost = laborCost;
        serviceOrder.EstimatedPartsCost = partItems.Sum(item => item.Quantity * item.UnitPrice);
        serviceOrder.EstimatedTotalCost = serviceOrder.EstimatedLaborCost + serviceOrder.EstimatedPartsCost;
    }

    private static void SoftDeleteEntity(Domain.Common.BaseEntity entity)
    {
        var now = DateTime.UtcNow;
        entity.IsDeleted = true;
        entity.DeletedAt = now;
        entity.UpdatedAt = now;
    }

    private sealed record ServicePartMutation(
        Guid PartId,
        string PartName,
        decimal UnitPrice,
        int Quantity,
        PartAvailability Availability
    );
}
