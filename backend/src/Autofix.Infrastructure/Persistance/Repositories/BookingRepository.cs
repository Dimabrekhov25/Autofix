using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Enum;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class BookingRepository(ApplicationDbContext dbContext) : IBookingRepository
{
    public async Task<Booking> AddAsync(Booking booking, CancellationToken cancellationToken)
    {
        dbContext.Bookings.Add(booking);
        await dbContext.SaveChangesAsync(cancellationToken);
        return booking;
    }

    public Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Bookings
            .AsNoTracking()
            .Include(x => x.Services.Where(service => !service.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<Booking>> GetAllAsync(CancellationToken cancellationToken)
    {
        var bookings = await dbContext.Bookings
            .AsNoTracking()
            .Include(x => x.Services.Where(service => !service.IsDeleted))
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.StartAt)
            .ToListAsync(cancellationToken);

        return bookings;
    }

    public async Task UpdateAsync(Booking booking, CancellationToken cancellationToken)
    {
        var existingBooking = await dbContext.Bookings
            .Include(x => x.Services)
            .FirstOrDefaultAsync(x => x.Id == booking.Id && !x.IsDeleted, cancellationToken);

        if (existingBooking is null)
        {
            return;
        }

        existingBooking.CustomerId = booking.CustomerId;
        existingBooking.VehicleId = booking.VehicleId;
        existingBooking.StartAt = booking.StartAt;
        existingBooking.EndAt = booking.EndAt;
        existingBooking.Status = booking.Status;
        existingBooking.UpdatedAt = booking.UpdatedAt ?? DateTime.UtcNow;

        var now = DateTime.UtcNow;
        foreach (var service in existingBooking.Services.Where(service => !service.IsDeleted))
        {
            service.IsDeleted = true;
            service.DeletedAt = now;
            service.UpdatedAt = now;
        }

        var newServices = booking.Services
            .Select(service => new BookingServiceItem
            {
                BookingId = existingBooking.Id,
                ServiceCatalogItemId = service.ServiceCatalogItemId,
                Name = service.Name,
                BasePrice = service.BasePrice,
                EstimatedDuration = service.EstimatedDuration
            })
            .ToList();

        if (newServices.Count > 0)
        {
            await dbContext.BookingServiceItems.AddRangeAsync(newServices, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var booking = await dbContext.Bookings
            .Include(x => x.Services)
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (booking is null)
        {
            return false;
        }

        var now = DateTime.UtcNow;
        booking.IsDeleted = true;
        booking.DeletedAt = now;
        booking.UpdatedAt = now;

        foreach (var service in booking.Services.Where(service => !service.IsDeleted))
        {
            service.IsDeleted = true;
            service.DeletedAt = now;
            service.UpdatedAt = now;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public Task<bool> HasOverlappingBookingAsync(
        Guid vehicleId,
        DateTime startAt,
        DateTime endAt,
        Guid? excludeBookingId,
        CancellationToken cancellationToken)
    {
        return dbContext.Bookings.AnyAsync(
            booking =>
                booking.VehicleId == vehicleId &&
                !booking.IsDeleted &&
                booking.Status != BookingStatus.Cancelled &&
                (!excludeBookingId.HasValue || booking.Id != excludeBookingId.Value) &&
                startAt < booking.EndAt &&
                endAt > booking.StartAt,
            cancellationToken);
    }
}
