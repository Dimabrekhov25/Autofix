using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.Common.Interfaces.Bookings;

/// <summary>
/// Orchestrates booking create/update/delete with related domain side effects (e.g. service order linkage).
/// </summary>
public interface IBookingLifecycleService
{
    /// <summary>Persists a new booking and synchronizes dependent state for the given services.</summary>
    Task<Booking> CreateAsync(
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services,
        CancellationToken cancellationToken);

    /// <summary>Updates booking and related flow; returns <c>null</c> if the booking no longer exists.</summary>
    Task<Booking?> UpdateAsync(
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services,
        CancellationToken cancellationToken);

    /// <summary>Deletes a booking and dependent data per business rules.</summary>
    Task<bool> DeleteAsync(Guid bookingId, CancellationToken cancellationToken);
}
