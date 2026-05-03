namespace Autofix.Application.ServiceOrders.Dtos;

/// <summary>
/// Labor line on a service order with approval flags and computed line total.
/// </summary>
public sealed record ServiceOrderWorkItemDto(
    Guid Id,
    string Description,
    decimal LaborHours,
    decimal HourlyRate,
    bool IsOptional,
    bool IsApproved,
    decimal LineTotal
);
