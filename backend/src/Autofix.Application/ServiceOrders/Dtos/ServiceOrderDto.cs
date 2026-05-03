using Autofix.Domain.Enum;

namespace Autofix.Application.ServiceOrders.Dtos;

/// <summary>
/// Workshop job read model: booking/customer/vehicle links, status, estimate totals, labor and part lines.
/// </summary>
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
