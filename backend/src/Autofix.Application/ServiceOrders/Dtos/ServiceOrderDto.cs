using Autofix.Domain.Enum;

namespace Autofix.Application.ServiceOrders.Dtos;

public sealed record ServiceOrderDto(
    Guid Id,
    Guid BookingId,
    Guid CustomerId,
    Guid VehicleId,
    Guid? MechanicId,
    ServiceOrderStatus Status,
    decimal EstimatedLaborCost,
    decimal EstimatedPartsCost,
    decimal EstimatedTotalCost,
    IReadOnlyList<ServiceOrderWorkItemDto> WorkItems,
    IReadOnlyList<ServiceOrderPartItemDto> PartItems
);
