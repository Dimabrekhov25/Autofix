using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Enum;

namespace Autofix.Application.Common.Interfaces;

/// <summary>
/// Persistence and scheduling helpers for <see cref="Booking"/> aggregates.
/// </summary>
public interface IBookingRepository
{
    /// <summary>Adds a new booking.</summary>
    Task<Booking> AddAsync(Booking booking, CancellationToken cancellationToken);
    /// <summary>Returns a booking by id or <c>null</c>.</summary>
    Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Lists bookings, optionally filtered by customer and/or vehicle.</summary>
    Task<IReadOnlyList<Booking>> GetAllAsync(
        Guid? customerId,
        Guid? vehicleId,
        CancellationToken cancellationToken);
    /// <summary>Persists updates to an existing booking.</summary>
    Task UpdateAsync(Booking booking, CancellationToken cancellationToken);
    /// <summary>Updates only payment option; returns updated aggregate or <c>null</c>.</summary>
    Task<Booking?> UpdatePaymentOptionAsync(
        Guid id,
        BookingPaymentOption paymentOption,
        CancellationToken cancellationToken);
    /// <summary>Deletes by id; <c>true</c> if a row was removed.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    /// <summary><c>true</c> if the vehicle already has another booking overlapping the interval.</summary>
    Task<bool> HasOverlappingBookingAsync(
        Guid vehicleId,
        DateTime startAt,
        DateTime endAt,
        Guid? excludeBookingId,
        CancellationToken cancellationToken);
    /// <summary>Workshop-wide count of bookings overlapping the interval (optionally excluding one booking).</summary>
    Task<int> CountOverlappingBookingsAsync(
        DateTime startAt,
        DateTime endAt,
        Guid? excludeBookingId,
        CancellationToken cancellationToken);
}
