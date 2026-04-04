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
}
