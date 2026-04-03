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
            entity.Vehicle is null
                ? null
                : new BookingVehicleDto(
                    entity.Vehicle.Id,
                    entity.Vehicle.LicensePlate,
                    entity.Vehicle.Vin,
                    entity.Vehicle.Make,
                    entity.Vehicle.Model,
                    entity.Vehicle.Year,
                    entity.Vehicle.Trim,
                    entity.Vehicle.Engine,
                    entity.Vehicle.IsDrivable),
            entity.BookingTimeSlotId,
            entity.StartAt,
            entity.EndAt,
            entity.Status,
            entity.PaymentOption,
            new BookingPricingDto(
                entity.Subtotal,
                entity.EstimatedLaborCost,
                entity.TaxAmount,
                entity.TotalEstimate,
                entity.Currency),
            entity.Notes,
            entity.Services
                .Where(service => !service.IsDeleted)
                .OrderBy(service => service.Name)
                .Select(service => new BookingServiceItemDto(
                    service.Id,
                    service.ServiceCatalogItemId,
                    service.Name,
                    service.Description,
                    service.Category,
                    service.BasePrice,
                    service.EstimatedLaborCost,
                    service.EstimatedDuration))
                .ToList());
}
