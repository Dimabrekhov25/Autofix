using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.Common.Interfaces.Bookings;

public interface IBookingLifecycleService
{
    Task<Booking> CreateAsync(
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services,
        CancellationToken cancellationToken);

    Task<Booking?> UpdateAsync(
        Booking booking,
        IReadOnlyList<ServiceCatalogItem> services,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid bookingId, CancellationToken cancellationToken);
}
