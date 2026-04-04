using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.ServiceOrders;
using Autofix.Domain.Enum;
using Microsoft.EntityFrameworkCore;
using Autofix.Infrastructure.Persistance.Services;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class ServiceOrderRepository(ApplicationDbContext dbContext) : IServiceOrderRepository
{
    public Task<ServiceOrder?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.ServiceOrders
            .AsNoTracking()
            .Include(x => x.WorkItems.Where(item => !item.IsDeleted))
            .Include(x => x.PartItems.Where(item => !item.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
    }

    public async Task<ServiceOrder?> GetByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken)
    {
        var existingServiceOrder = await dbContext.ServiceOrders
            .AsNoTracking()
            .Include(x => x.WorkItems.Where(item => !item.IsDeleted))
            .Include(x => x.PartItems.Where(item => !item.IsDeleted))
            .FirstOrDefaultAsync(x => x.BookingId == bookingId && !x.IsDeleted, cancellationToken);

        if (existingServiceOrder is not null)
        {
            return existingServiceOrder;
        }

        var booking = await dbContext.Bookings
            .Include(x => x.Services.Where(service => !service.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == bookingId && !x.IsDeleted, cancellationToken);

        if (booking is null)
        {
            return null;
        }

        return await CreateLegacyServiceOrderAsync(booking, cancellationToken);
    }

    private async Task<ServiceOrder> CreateLegacyServiceOrderAsync(
        Booking booking,
        CancellationToken cancellationToken)
    {
        var serviceOrder = new ServiceOrder
        {
            BookingId = booking.Id,
            CustomerId = booking.CustomerId,
            VehicleId = booking.VehicleId,
            Status = ServiceOrderStatus.Created
        };

        var workItems = booking.Services
            .Where(service => !service.IsDeleted)
            .Select(service => CreateWorkItem(serviceOrder.Id, service))
            .ToList();

        if (workItems.Count > 0)
        {
            serviceOrder.WorkItems.AddRange(workItems);
        }

        var serviceIds = booking.Services
            .Where(service => !service.IsDeleted)
            .Select(service => service.ServiceCatalogItemId)
            .Distinct()
            .ToList();

        if (serviceIds.Count > 0)
        {
            var catalogServices = await dbContext.ServiceCatalogItems
                .Include(item => item.RequiredParts.Where(part => !part.IsDeleted))
                .ThenInclude(requirement => requirement.Part)
                .Where(item => serviceIds.Contains(item.Id) && !item.IsDeleted)
                .ToListAsync(cancellationToken);

            var requiredPartMutations = BookingLifecycleService.AggregateRequiredPartMutations(catalogServices);
            var inventoryByPartId = await dbContext.InventoryItems
                .Where(item => requiredPartMutations.Select(mutation => mutation.PartId).Contains(item.PartId) && !item.IsDeleted)
                .ToDictionaryAsync(item => item.PartId, cancellationToken);

            var now = DateTime.UtcNow;
            foreach (var mutation in requiredPartMutations)
            {
                var availability = PartAvailability.BackOrder;

                if (inventoryByPartId.TryGetValue(mutation.PartId, out var inventoryItem))
                {
                    var availableQuantity = inventoryItem.QuantityOnHand - inventoryItem.ReservedQuantity;
                    if (availableQuantity >= mutation.Quantity)
                    {
                        inventoryItem.ReservedQuantity += mutation.Quantity;
                        inventoryItem.UpdatedAt = now;
                        availability = PartAvailability.InStock;

                        dbContext.InventoryMovements.Add(new Domain.Entities.Inventory.InventoryMovement
                        {
                            PartId = mutation.PartId,
                            MovementType = InventoryMovementType.Reservation,
                            Quantity = mutation.Quantity,
                            Reason = $"Legacy booking reservation bootstrap for {booking.Id}",
                            OccurredAt = now
                        });
                    }
                }

                serviceOrder.PartItems.Add(new ServicePartItem
                {
                    ServiceOrderId = serviceOrder.Id,
                    PartId = mutation.PartId,
                    PartName = mutation.PartName,
                    Quantity = mutation.Quantity,
                    UnitPrice = mutation.UnitPrice,
                    Availability = availability,
                    IsApproved = false
                });
            }
        }

        BookingLifecycleService.RecalculateTotals(serviceOrder);
        dbContext.ServiceOrders.Add(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);

        return await dbContext.ServiceOrders
            .AsNoTracking()
            .Include(x => x.WorkItems.Where(item => !item.IsDeleted))
            .Include(x => x.PartItems.Where(item => !item.IsDeleted))
            .FirstAsync(x => x.Id == serviceOrder.Id && !x.IsDeleted, cancellationToken);
    }

    private static ServiceWorkItem CreateWorkItem(Guid serviceOrderId, BookingServiceItem service)
    {
        var laborHours = decimal.Round((decimal)service.EstimatedDuration.TotalHours, 2, MidpointRounding.AwayFromZero);
        var hourlyRate = laborHours > 0
            ? decimal.Round(service.EstimatedLaborCost / laborHours, 2, MidpointRounding.AwayFromZero)
            : service.EstimatedLaborCost;

        return new ServiceWorkItem
        {
            ServiceOrderId = serviceOrderId,
            Description = service.Name,
            LaborHours = laborHours,
            HourlyRate = hourlyRate,
            IsOptional = false,
            IsApproved = false
        };
    }
}
