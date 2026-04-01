using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Booking;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class BookingTimeSlotRepository(ApplicationDbContext dbContext) : IBookingTimeSlotRepository
{
    public async Task<IReadOnlyList<BookingTimeSlot>> GetActiveByDateAsync(DateTime date, CancellationToken cancellationToken)
    {
        var dayStart = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
        var dayEnd = dayStart.AddDays(1);

        return await dbContext.BookingTimeSlots
            .AsNoTracking()
            .Where(slot =>
                !slot.IsDeleted &&
                slot.IsActive &&
                slot.StartAt >= dayStart &&
                slot.StartAt < dayEnd)
            .OrderBy(slot => slot.StartAt)
            .ToListAsync(cancellationToken);
    }

    public Task<BookingTimeSlot?> GetActiveByStartAtAsync(DateTime startAt, CancellationToken cancellationToken)
    {
        return dbContext.BookingTimeSlots
            .AsNoTracking()
            .FirstOrDefaultAsync(slot =>
                    !slot.IsDeleted &&
                    slot.IsActive &&
                    slot.StartAt == startAt,
                cancellationToken);
    }
}
