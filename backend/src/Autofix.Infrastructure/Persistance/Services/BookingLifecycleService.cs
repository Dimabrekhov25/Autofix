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
    public async Task<Booking> CreateAsync(
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services,
        CancellationToken cancellationToken)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            IsolationLevel.ReadCommitted,
            cancellationToken);

        var serviceOrder = CreateServiceOrder(booking, services);

        dbContext.Bookings.Add(booking);
        dbContext.ServiceOrders.Add(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        booking.ServiceOrder = serviceOrder;
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
            .Include(x => x.ServiceOrder!)
            .ThenInclude(x => x.WorkItems)
            .Include(x => x.ServiceOrder!)
            .ThenInclude(x => x.PartItems)
            .FirstOrDefaultAsync(x => x.Id == booking.Id && !x.IsDeleted, cancellationToken);

        if (existingBooking is null)
        {
            return null;
        }

        var serviceOrder = existingBooking.ServiceOrder;
        if (serviceOrder is null)
        {
            throw new NotFoundException("ServiceOrder", booking.Id);
        }

        if (serviceOrder.Status != ServiceOrderStatus.Pending)
        {
            throw new BadRequestException("Booking cannot be updated after estimate processing has started.");
        }

        SoftDeleteCollection(existingBooking.Services);
        SoftDeleteCollection(serviceOrder.WorkItems);

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
            .Include(x => x.ServiceOrder!)
            .ThenInclude(x => x.WorkItems)
            .Include(x => x.ServiceOrder!)
            .ThenInclude(x => x.PartItems)
            .FirstOrDefaultAsync(x => x.Id == bookingId && !x.IsDeleted, cancellationToken);

        if (booking is null)
        {
            return false;
        }

        if (booking.Status == BookingStatus.Completed)
        {
            throw new BadRequestException("Completed bookings cannot be cancelled.");
        }

        var serviceOrder = booking.ServiceOrder;
        if (serviceOrder?.Status is ServiceOrderStatus.InProgress or ServiceOrderStatus.Completed)
        {
            throw new BadRequestException("Bookings already in repair cannot be cancelled.");
        }

        var now = DateTime.UtcNow;
        booking.Status = BookingStatus.Cancelled;
        booking.UpdatedAt = now;

        if (serviceOrder is not null)
        {
            serviceOrder.Status = ServiceOrderStatus.Cancelled;
            serviceOrder.UpdatedAt = now;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return true;
    }

    internal static ServiceOrder CreateServiceOrder(Booking booking, IReadOnlyList<ServiceCatalogItem> services)
    {
        var serviceOrder = new ServiceOrder
        {
            Booking = booking,
            CustomerId = booking.CustomerId,
            VehicleId = booking.VehicleId,
            Status = ServiceOrderStatus.Pending
        };

        ApplyServices(serviceOrder, services);
        return serviceOrder;
    }

    internal static void ApplyServiceOrderFromServices(
        ServiceOrder serviceOrder,
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services)
    {
        serviceOrder.CustomerId = booking.CustomerId;
        serviceOrder.VehicleId = booking.VehicleId;
        serviceOrder.BookingId = booking.Id;
        serviceOrder.Status = MapBookingStatus(booking.Status);
        serviceOrder.UpdatedAt = DateTime.UtcNow;

        ApplyServices(serviceOrder, services);
    }

    internal static void ApplyServices(ServiceOrder serviceOrder, IReadOnlyList<ServiceCatalogItem> services)
    {
        var workItems = services
            .Select(service => CreateWorkItem(serviceOrder.Id, service))
            .ToList();

        if (workItems.Count > 0)
        {
            serviceOrder.WorkItems.AddRange(workItems);
        }

        RecalculateTotals(serviceOrder);
    }

    internal static ServiceWorkItem CreateWorkItem(Guid serviceOrderId, ServiceCatalogItem service)
    {
        return new ServiceWorkItem
        {
            ServiceOrderId = serviceOrderId,
            Description = service.Name,
            LaborHours = 1m,
            HourlyRate = service.BasePrice,
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

    internal static BookingStatus MapServiceOrderStatus(ServiceOrderStatus status)
        => status switch
        {
            ServiceOrderStatus.Pending => BookingStatus.Pending,
            ServiceOrderStatus.AwaitingApproval => BookingStatus.AwaitingApproval,
            ServiceOrderStatus.Approved => BookingStatus.Approved,
            ServiceOrderStatus.InProgress => BookingStatus.InProgress,
            ServiceOrderStatus.Completed => BookingStatus.Completed,
            ServiceOrderStatus.Cancelled => BookingStatus.Cancelled,
            ServiceOrderStatus.ChangesRequested => BookingStatus.ChangesRequested,
            _ => BookingStatus.Pending
        };

    internal static ServiceOrderStatus MapBookingStatus(BookingStatus status)
        => status switch
        {
            BookingStatus.Pending => ServiceOrderStatus.Pending,
            BookingStatus.AwaitingApproval => ServiceOrderStatus.AwaitingApproval,
            BookingStatus.Approved => ServiceOrderStatus.Approved,
            BookingStatus.InProgress => ServiceOrderStatus.InProgress,
            BookingStatus.Completed => ServiceOrderStatus.Completed,
            BookingStatus.Cancelled => ServiceOrderStatus.Cancelled,
            BookingStatus.ChangesRequested => ServiceOrderStatus.ChangesRequested,
            _ => ServiceOrderStatus.Pending
        };

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
