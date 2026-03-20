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
            .Include(booking => booking.Services.Where(service => !service.IsDeleted))
            .FirstOrDefaultAsync(booking => booking.Id == id && !booking.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<Booking>> GetAllAsync(CancellationToken cancellationToken)
    {
        var bookings = await dbContext.Bookings
            .AsNoTracking()
            .Include(booking => booking.Services.Where(service => !service.IsDeleted))
            .Where(booking => !booking.IsDeleted)
            .OrderByDescending(booking => booking.StartAt)
            .ToListAsync(cancellationToken);

        return bookings;
    }

    public async Task UpdateAsync(Booking booking, CancellationToken cancellationToken)
    {
        var existing = await dbContext.Bookings
            .Include(x => x.Services.Where(service => !service.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == booking.Id && !x.IsDeleted, cancellationToken);

        if (existing is null)
        {
            return;
        }

        existing.CustomerId = booking.CustomerId;
        existing.VehicleId = booking.VehicleId;
        existing.StartAt = booking.StartAt;
        existing.EndAt = booking.EndAt;
        existing.Status = booking.Status;
        existing.UpdatedAt = booking.UpdatedAt ?? DateTime.UtcNow;

        foreach (var service in existing.Services)
        {
            service.IsDeleted = true;
            service.DeletedAt = DateTime.UtcNow;
            service.UpdatedAt = DateTime.UtcNow;
        }

        foreach (var service in booking.Services)
        {
            existing.Services.Add(service);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var booking = await dbContext.Bookings
            .Include(x => x.Services.Where(service => !service.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (booking is null)
        {
            return false;
        }

        booking.IsDeleted = true;
        booking.DeletedAt = DateTime.UtcNow;
        booking.UpdatedAt = DateTime.UtcNow;

        foreach (var service in booking.Services)
        {
            service.IsDeleted = true;
            service.DeletedAt = DateTime.UtcNow;
            service.UpdatedAt = DateTime.UtcNow;
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
        return dbContext.Bookings
            .AsNoTracking()
            .Where(booking => !booking.IsDeleted)
            .Where(booking => booking.VehicleId == vehicleId)
            .Where(booking => booking.Status == BookingStatus.Created || booking.Status == BookingStatus.Confirmed)
            .Where(booking => !excludeBookingId.HasValue || booking.Id != excludeBookingId.Value)
            .AnyAsync(booking => booking.StartAt < endAt && booking.EndAt > startAt, cancellationToken);
    }
}
