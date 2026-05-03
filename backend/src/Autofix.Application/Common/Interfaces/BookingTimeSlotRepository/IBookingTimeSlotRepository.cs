using Autofix.Domain.Entities.Booking;

namespace Autofix.Application.Common.Interfaces;

/// <summary>
/// Read-only access to predefined bookable time slots (templates).
/// </summary>
public interface IBookingTimeSlotRepository
{
    /// <summary>Active slots whose calendar day matches <paramref name="date"/>.</summary>
    Task<IReadOnlyList<BookingTimeSlot>> GetActiveByDateAsync(DateTime date, CancellationToken cancellationToken);
    /// <summary>Finds the active slot with this exact start time, if any.</summary>
    Task<BookingTimeSlot?> GetActiveByStartAtAsync(DateTime startAt, CancellationToken cancellationToken);
}
