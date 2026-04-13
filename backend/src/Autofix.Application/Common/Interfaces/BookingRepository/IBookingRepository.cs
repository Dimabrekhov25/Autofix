using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Enum;

namespace Autofix.Application.Common.Interfaces;

public interface IBookingRepository
{
    Task<Booking> AddAsync(Booking booking, CancellationToken cancellationToken);
    Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<Booking>> GetAllAsync(
        Guid? customerId,
        Guid? vehicleId,
        CancellationToken cancellationToken);
    Task UpdateAsync(Booking booking, CancellationToken cancellationToken);
    Task<Booking?> UpdatePaymentOptionAsync(
        Guid id,
        BookingPaymentOption paymentOption,
        CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> HasOverlappingBookingAsync(
        Guid vehicleId,
        DateTime startAt,
        DateTime endAt,
        Guid? excludeBookingId,
        CancellationToken cancellationToken);
    Task<int> CountOverlappingBookingsAsync(
        DateTime startAt,
        DateTime endAt,
        Guid? excludeBookingId,
        CancellationToken cancellationToken);
}
