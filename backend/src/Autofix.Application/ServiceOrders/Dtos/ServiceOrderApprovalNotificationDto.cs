using Autofix.Domain.Enum;

namespace Autofix.Application.ServiceOrders.Dtos;

public sealed record ServiceOrderApprovalNotificationDto(
    Guid ServiceOrderId,
    Guid BookingId,
    Guid CustomerId,
    Guid VehicleId,
    string CustomerName,
    string VehicleDisplayName,
    string LicensePlate,
    DateTime BookingStartAt,
    ServiceOrderStatus Status,
    decimal EstimatedTotalCost,
    IReadOnlyList<string> RequestedServices,
    DateTime CustomerApprovedAt,
    DateTime? ReadAt
);
