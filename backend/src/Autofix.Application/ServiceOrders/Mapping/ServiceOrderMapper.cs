using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Domain.Entities.ServiceOrders;

namespace Autofix.Application.ServiceOrders.Mapping;

public static class ServiceOrderMapper
{
    public static ServiceOrderDto ToDto(this ServiceOrder entity)
        => new(
            entity.Id,
            entity.BookingId,
            entity.CustomerId,
            entity.VehicleId,
            entity.MechanicId,
            entity.Status,
            entity.EstimatedLaborCost,
            entity.EstimatedPartsCost,
            entity.EstimatedTotalCost,
            entity.WorkItems
                .Where(item => !item.IsDeleted)
                .OrderBy(item => item.Description)
                .Select(item => new ServiceOrderWorkItemDto(
                    item.Id,
                    item.Description,
                    item.LaborHours,
                    item.HourlyRate,
                    item.IsOptional,
                    item.IsApproved,
                    item.LaborHours * item.HourlyRate))
                .ToList(),
            entity.PartItems
                .Where(item => !item.IsDeleted)
                .OrderBy(item => item.PartName)
                .Select(item => new ServiceOrderPartItemDto(
                    item.Id,
                    item.PartId,
                    item.PartName,
                    item.Quantity,
                    item.UnitPrice,
                    item.Availability,
                    item.IsApproved,
                    item.Quantity * item.UnitPrice))
                .ToList());

    public static ServiceOrderApprovalNotificationDto ToApprovalNotificationDto(this ServiceOrder entity)
        => new(
            entity.Id,
            entity.BookingId,
            entity.CustomerId,
            entity.VehicleId,
            entity.Customer?.FullName?.Trim() is { Length: > 0 } customerName
                ? customerName
                : "Customer",
            BuildVehicleDisplayName(entity),
            entity.Vehicle?.LicensePlate?.Trim() is { Length: > 0 } licensePlate
                ? licensePlate
                : "Pending",
            entity.Booking?.StartAt ?? entity.CreatedAt,
            entity.Status,
            entity.EstimatedTotalCost,
            entity.Booking?.Services
                .Where(service => !service.IsDeleted)
                .OrderBy(service => service.Name)
                .Select(service => service.Name)
                .ToList()
                ?? new List<string>(),
            entity.CustomerApprovedAt ?? entity.UpdatedAt ?? entity.CreatedAt,
            entity.CustomerApprovalNotificationReadAt);

    private static string BuildVehicleDisplayName(ServiceOrder entity)
    {
        if (entity.Vehicle is null)
        {
            return "Vehicle pending";
        }

        var vehicleParts = new[]
        {
            entity.Vehicle.Year > 0 ? entity.Vehicle.Year.ToString() : null,
            entity.Vehicle.Make?.Trim(),
            entity.Vehicle.Model?.Trim()
        }
            .Where(part => !string.IsNullOrWhiteSpace(part))
            .ToArray();

        return vehicleParts.Length > 0
            ? string.Join(" ", vehicleParts)
            : entity.Vehicle.LicensePlate?.Trim() ?? "Vehicle pending";
    }
}
