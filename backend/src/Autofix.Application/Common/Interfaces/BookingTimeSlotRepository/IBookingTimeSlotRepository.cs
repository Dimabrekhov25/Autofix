using Autofix.Domain.Entities.Booking;

namespace Autofix.Application.Common.Interfaces;

public interface IBookingTimeSlotRepository
{
    Task<IReadOnlyList<BookingTimeSlot>> GetActiveByDateAsync(DateTime date, CancellationToken cancellationToken);
    Task<BookingTimeSlot?> GetActiveByStartAtAsync(DateTime startAt, CancellationToken cancellationToken);
}
