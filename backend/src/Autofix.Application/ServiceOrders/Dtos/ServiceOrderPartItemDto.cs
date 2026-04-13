using Autofix.Domain.Enum;

namespace Autofix.Application.ServiceOrders.Dtos;

public sealed record ServiceOrderPartItemDto(
    Guid Id,
    Guid PartId,
    string PartName,
    int Quantity,
    decimal UnitPrice,
    PartAvailability Availability,
    bool IsApproved,
    decimal LineTotal
);
