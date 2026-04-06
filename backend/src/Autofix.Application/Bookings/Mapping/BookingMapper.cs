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
                .ToList(),
            entity.ServiceOrder is null
                ? null
                : new BookingEstimateDto(
                    entity.ServiceOrder.Id,
                    entity.ServiceOrder.Status,
                    entity.ServiceOrder.EstimatedLaborCost,
                    entity.ServiceOrder.EstimatedPartsCost,
                    entity.ServiceOrder.EstimatedTotalCost,
                    entity.ServiceOrder.WorkItems
                        .Where(item => !item.IsDeleted)
                        .OrderBy(item => item.Description)
                        .Select(item => new BookingEstimateWorkItemDto(
                            item.Id,
                            item.Description,
                            item.LaborHours,
                            item.HourlyRate,
                            item.LaborHours * item.HourlyRate))
                        .ToList(),
                    entity.ServiceOrder.PartItems
                        .Where(item => !item.IsDeleted)
                        .OrderBy(item => item.PartName)
                        .Select(item => new BookingEstimatePartItemDto(
                            item.Id,
                            item.PartId,
                            item.PartName,
                            item.Quantity,
                            item.UnitPrice,
                            item.Availability,
                            item.Quantity * item.UnitPrice))
                        .ToList()),
            entity.CreatedAt,
            entity.UpdatedAt);
}
