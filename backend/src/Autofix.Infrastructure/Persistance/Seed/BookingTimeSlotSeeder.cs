using Autofix.Application.Common.Interfaces.BookingFlow;
using Autofix.Domain.Entities.Booking;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Seed;

internal static class BookingTimeSlotSeeder
{
    private const int DaysBackfill = 7;
    private const int DaysAhead = 120;

    public static async Task SeedAsync(
        ApplicationDbContext dbContext,
        IBookingFlowSettings bookingFlowSettings,
        CancellationToken cancellationToken)
    {
        var startDate = DateTime.UtcNow.Date.AddDays(-DaysBackfill);
        var endDate = DateTime.UtcNow.Date.AddDays(DaysAhead);
        var rangeEndExclusive = endDate.AddDays(1);

        var existingStarts = await dbContext.BookingTimeSlots
            .Where(slot =>
                !slot.IsDeleted &&
                slot.StartAt >= startDate &&
                slot.StartAt < rangeEndExclusive)
            .Select(slot => slot.StartAt)
            .ToListAsync(cancellationToken);

        var existingSet = existingStarts.ToHashSet();
        var slotsToAdd = new List<BookingTimeSlot>();

        for (var day = startDate; day <= endDate; day = day.AddDays(1))
        {
            var workshopDayStart = DateTime.SpecifyKind(day, DateTimeKind.Utc) + bookingFlowSettings.WorkshopDayStart;
            var workshopDayEnd = DateTime.SpecifyKind(day, DateTimeKind.Utc) + bookingFlowSettings.WorkshopDayEnd;

            for (var slotStart = workshopDayStart; slotStart < workshopDayEnd; slotStart = slotStart.AddMinutes(bookingFlowSettings.SlotIntervalMinutes))
            {
                if (existingSet.Contains(slotStart))
                {
                    continue;
                }

                slotsToAdd.Add(new BookingTimeSlot
                {
                    StartAt = slotStart,
                    Label = slotStart.ToString("hh:mm tt"),
                    IsActive = true
                });
            }
        }

        if (slotsToAdd.Count == 0)
        {
            return;
        }

        await dbContext.BookingTimeSlots.AddRangeAsync(slotsToAdd, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
