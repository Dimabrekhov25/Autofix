using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.ServiceOrders;
using Microsoft.EntityFrameworkCore;
using Autofix.Infrastructure.Persistance.Services;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class ServiceOrderRepository(ApplicationDbContext dbContext) : IServiceOrderRepository
{
    public Task<ServiceOrder?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.ServiceOrders
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Vehicle)
            .Include(x => x.Booking!)
            .ThenInclude(x => x.Services.Where(service => !service.IsDeleted))
            .Include(x => x.WorkItems.Where(item => !item.IsDeleted))
            .Include(x => x.PartItems.Where(item => !item.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
    }

    public async Task<ServiceOrder?> GetByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken)
    {
        var existingServiceOrder = await dbContext.ServiceOrders
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Vehicle)
            .Include(x => x.Booking!)
            .ThenInclude(x => x.Services.Where(service => !service.IsDeleted))
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
            Status = BookingLifecycleService.MapBookingStatus(booking.Status)
        };

        var workItems = booking.Services
            .Where(service => !service.IsDeleted)
            .Select(service => CreateWorkItem(serviceOrder.Id, service))
            .ToList();

        if (workItems.Count > 0)
        {
            serviceOrder.WorkItems.AddRange(workItems);
        }

        BookingLifecycleService.RecalculateTotals(serviceOrder);
        dbContext.ServiceOrders.Add(serviceOrder);
        await dbContext.SaveChangesAsync(cancellationToken);

        return await dbContext.ServiceOrders
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Vehicle)
            .Include(x => x.Booking!)
            .ThenInclude(x => x.Services.Where(service => !service.IsDeleted))
            .Include(x => x.WorkItems.Where(item => !item.IsDeleted))
            .Include(x => x.PartItems.Where(item => !item.IsDeleted))
            .FirstAsync(x => x.Id == serviceOrder.Id && !x.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<ServiceOrder>> GetUnreadCustomerApprovalNotificationsAsync(CancellationToken cancellationToken)
    {
        var serviceOrders = await dbContext.ServiceOrders
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Vehicle)
            .Include(x => x.Booking!)
            .ThenInclude(x => x.Services.Where(service => !service.IsDeleted))
            .Where(x =>
                !x.IsDeleted &&
                x.CustomerApprovedAt.HasValue &&
                x.CustomerApprovalNotificationReadAt == null)
            .OrderByDescending(x => x.CustomerApprovedAt)
            .ToListAsync(cancellationToken);

        return serviceOrders;
    }

    public async Task<ServiceOrder?> MarkCustomerApprovalNotificationReadAsync(
        Guid serviceOrderId,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await dbContext.ServiceOrders
            .Include(x => x.Customer)
            .Include(x => x.Vehicle)
            .Include(x => x.Booking!)
            .ThenInclude(x => x.Services.Where(service => !service.IsDeleted))
            .FirstOrDefaultAsync(
                x => x.Id == serviceOrderId && !x.IsDeleted && x.CustomerApprovedAt.HasValue,
                cancellationToken);

        if (serviceOrder is null)
        {
            return null;
        }

        if (serviceOrder.CustomerApprovalNotificationReadAt is null)
        {
            serviceOrder.CustomerApprovalNotificationReadAt = DateTime.UtcNow;
            serviceOrder.UpdatedAt = serviceOrder.CustomerApprovalNotificationReadAt;
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return serviceOrder;
    }

    private static ServiceWorkItem CreateWorkItem(Guid serviceOrderId, BookingServiceItem service)
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
}
