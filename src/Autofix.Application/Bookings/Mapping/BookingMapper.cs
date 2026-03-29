using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Entities.Booking;

namespace Autofix.Application.Bookings.Mapping;

public static class BookingMapper
{
    public static BookingDto ToDto(this Booking entity)
        => new(
            entity.Id,
            entity.CustomerId,
            entity.VehicleId,
            entity.StartAt,
            entity.EndAt,
            entity.Status,
            entity.Services
                .Where(service => !service.IsDeleted)
                .OrderBy(service => service.Name)
                .Select(service => new BookingServiceItemDto(
                    service.Id,
                    service.ServiceCatalogItemId,
                    service.Name,
                    service.BasePrice,
                    service.EstimatedDuration))
                .ToList());
}
