using System.Data;
using Autofix.Application.Common.Interfaces.Bookings;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Entities.ServiceOrders;
using Autofix.Domain.Enum;
using Autofix.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Services;

public sealed class BookingLifecycleService(ApplicationDbContext dbContext)
    : IBookingLifecycleService
{
    private readonly InventoryMutationService inventoryMutationService = new(dbContext);

    public async Task<Booking> CreateAsync(
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services,
        CancellationToken cancellationToken)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            IsolationLevel.ReadCommitted,
            cancellationToken);

        var serviceOrder = CreateServiceOrder(booking, services);
        var partMutations = AggregateRequiredPartMutations(services);

        await inventoryMutationService.ReserveAsync(
            partMutations,
            $"Booking reservation for {booking.Id}",
            cancellationToken);

        dbContext.Bookings.Add(booking);
        dbContext.ServiceOrders.Add(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return booking;
    }

    public async Task<Booking?> UpdateAsync(
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services,
        CancellationToken cancellationToken)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            IsolationLevel.ReadCommitted,
            cancellationToken);

        var existingBooking = await dbContext.Bookings
            .Include(x => x.Services)
            .Include(x => x.Vehicle)
            .FirstOrDefaultAsync(x => x.Id == booking.Id && !x.IsDeleted, cancellationToken);

        if (existingBooking is null)
        {
            return null;
        }

        var serviceOrder = await dbContext.ServiceOrders
            .Include(x => x.WorkItems)
            .Include(x => x.PartItems)
            .FirstOrDefaultAsync(x => x.BookingId == booking.Id && !x.IsDeleted, cancellationToken);

        if (serviceOrder is null)
        {
            throw new NotFoundException("ServiceOrder", booking.Id);
        }

        if (serviceOrder.Status != ServiceOrderStatus.Created)
        {
            throw new BadRequestException("Booking cannot be updated after service order processing has started.");
        }

        await inventoryMutationService.ReleaseAsync(
            serviceOrder.PartItems
                .Where(item => !item.IsDeleted)
                .Select(item => new InventoryPartMutation(item.PartId, item.PartName, item.UnitPrice, item.Quantity))
                .ToList(),
            $"Booking update release for {booking.Id}",
            cancellationToken);

        SoftDeleteCollection(existingBooking.Services);
        SoftDeleteCollection(serviceOrder.WorkItems);
        SoftDeleteCollection(serviceOrder.PartItems);

        existingBooking.CustomerId = booking.CustomerId;
        existingBooking.VehicleId = booking.VehicleId;
        existingBooking.BookingTimeSlotId = booking.BookingTimeSlotId;
        existingBooking.StartAt = booking.StartAt;
        existingBooking.EndAt = booking.EndAt;
        existingBooking.Status = booking.Status;
        existingBooking.PaymentOption = booking.PaymentOption;
        existingBooking.Currency = booking.Currency;
        existingBooking.Subtotal = booking.Subtotal;
        existingBooking.EstimatedLaborCost = booking.EstimatedLaborCost;
        existingBooking.TaxAmount = booking.TaxAmount;
        existingBooking.TotalEstimate = booking.TotalEstimate;
        existingBooking.Notes = booking.Notes;
        existingBooking.UpdatedAt = DateTime.UtcNow;

        var replacementServices = booking.Services
            .Select(service => new BookingServiceItem
            {
                BookingId = existingBooking.Id,
                ServiceCatalogItemId = service.ServiceCatalogItemId,
                Name = service.Name,
                Description = service.Description,
                Category = service.Category,
                BasePrice = service.BasePrice,
                EstimatedLaborCost = service.EstimatedLaborCost,
                EstimatedDuration = service.EstimatedDuration
            })
            .ToList();

        if (replacementServices.Count > 0)
        {
            await dbContext.BookingServiceItems.AddRangeAsync(replacementServices, cancellationToken);
        }

        ApplyServiceOrderFromServices(serviceOrder, existingBooking, services);

        var partMutations = serviceOrder.PartItems
            .Where(item => !item.IsDeleted)
            .Select(item => new InventoryPartMutation(item.PartId, item.PartName, item.UnitPrice, item.Quantity))
            .ToList();

        await inventoryMutationService.ReserveAsync(
            partMutations,
            $"Booking update reservation for {booking.Id}",
            cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        existingBooking.Services = replacementServices;
        return existingBooking;
    }

    public async Task<bool> DeleteAsync(Guid bookingId, CancellationToken cancellationToken)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            IsolationLevel.ReadCommitted,
            cancellationToken);

        var booking = await dbContext.Bookings
            .Include(x => x.Services)
            .FirstOrDefaultAsync(x => x.Id == bookingId && !x.IsDeleted, cancellationToken);

        if (booking is null)
        {
            return false;
        }

        var serviceOrder = await dbContext.ServiceOrders
            .Include(x => x.DiagnosisItems)
            .Include(x => x.WorkItems)
            .Include(x => x.PartItems)
            .FirstOrDefaultAsync(x => x.BookingId == bookingId && !x.IsDeleted, cancellationToken);

        if (serviceOrder?.Status == ServiceOrderStatus.Completed)
        {
            throw new BadRequestException("Completed bookings cannot be cancelled.");
        }

        if (serviceOrder is not null)
        {
            await inventoryMutationService.ReleaseAsync(
                serviceOrder.PartItems
                    .Where(item => !item.IsDeleted)
                    .Select(item => new InventoryPartMutation(item.PartId, item.PartName, item.UnitPrice, item.Quantity))
                    .ToList(),
                $"Booking cancellation release for {booking.Id}",
                cancellationToken);

            SoftDeleteCollection(serviceOrder.DiagnosisItems);
            SoftDeleteCollection(serviceOrder.WorkItems);
            SoftDeleteCollection(serviceOrder.PartItems);
            SoftDeleteEntity(serviceOrder);
        }

        SoftDeleteCollection(booking.Services);
        SoftDeleteEntity(booking);

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return true;
    }

    private static ServiceOrder CreateServiceOrder(Booking booking, IReadOnlyList<ServiceCatalogItem> services)
    {
        var serviceOrder = new ServiceOrder
        {
            Booking = booking,
            CustomerId = booking.CustomerId,
            VehicleId = booking.VehicleId,
            Status = ServiceOrderStatus.Created
        };

        ApplyServices(serviceOrder, services);
        return serviceOrder;
    }

    private static void ApplyServiceOrderFromServices(
        ServiceOrder serviceOrder,
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services)
    {
        serviceOrder.CustomerId = booking.CustomerId;
        serviceOrder.VehicleId = booking.VehicleId;
        serviceOrder.BookingId = booking.Id;
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        ApplyServices(serviceOrder, services);
    }

    private static void ApplyServices(ServiceOrder serviceOrder, IReadOnlyList<ServiceCatalogItem> services)
    {
        var workItems = services
            .Select(service => CreateWorkItem(serviceOrder.Id, service))
            .ToList();

        var partItems = AggregateRequiredPartMutations(services)
            .Select(mutation => new ServicePartItem
            {
                ServiceOrderId = serviceOrder.Id,
                PartId = mutation.PartId,
                PartName = mutation.PartName,
                Quantity = mutation.Quantity,
                UnitPrice = mutation.UnitPrice,
                Availability = PartAvailability.InStock,
                IsApproved = false
            })
            .ToList();

        if (workItems.Count > 0)
        {
            serviceOrder.WorkItems.AddRange(workItems);
        }

        if (partItems.Count > 0)
        {
            serviceOrder.PartItems.AddRange(partItems);
        }

        RecalculateTotals(serviceOrder);
    }

    internal static List<InventoryPartMutation> AggregateRequiredPartMutations(
        IReadOnlyCollection<ServiceCatalogItem> services)
    {
        return services
            .Where(service => service.Category == ServiceCatalogCategory.Service)
            .SelectMany(service => service.RequiredParts.Where(part => !part.IsDeleted && part.Part is not null))
            .GroupBy(part => part.PartId)
            .Select(group => new InventoryPartMutation(
                group.Key,
                group.First().Part!.Name,
                group.First().Part!.UnitPrice,
                group.Sum(item => item.Quantity)))
            .ToList();
    }

    internal static ServiceWorkItem CreateWorkItem(Guid serviceOrderId, ServiceCatalogItem service)
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

    internal static void RecalculateTotals(ServiceOrder serviceOrder)
    {
        serviceOrder.EstimatedLaborCost = serviceOrder.WorkItems
            .Where(item => !item.IsDeleted)
            .Sum(item => item.LaborHours * item.HourlyRate);

        serviceOrder.EstimatedPartsCost = serviceOrder.PartItems
            .Where(item => !item.IsDeleted)
            .Sum(item => item.Quantity * item.UnitPrice);

        serviceOrder.EstimatedTotalCost = serviceOrder.EstimatedLaborCost + serviceOrder.EstimatedPartsCost;
    }

    private static void SoftDeleteCollection<T>(IEnumerable<T> entities)
        where T : Domain.Common.BaseEntity
    {
        foreach (var entity in entities.Where(entity => !entity.IsDeleted))
        {
            SoftDeleteEntity(entity);
        }
    }

    private static void SoftDeleteEntity(Domain.Common.BaseEntity entity)
    {
        var now = DateTime.UtcNow;
        entity.IsDeleted = true;
        entity.DeletedAt = now;
        entity.UpdatedAt = now;
    }
}
