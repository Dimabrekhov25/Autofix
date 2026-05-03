using Autofix.Domain.Enum;

namespace Autofix.Application.ServiceOrders.Dtos;

/// <summary>
/// Part line on a service order: part reference, quantity, price, availability, approval, line total.
/// </summary>
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
