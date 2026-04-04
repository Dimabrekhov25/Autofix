namespace Autofix.Application.ServiceOrders.Dtos;

public sealed record ServiceOrderWorkItemDto(
    Guid Id,
    string Description,
    decimal LaborHours,
    decimal HourlyRate,
    bool IsOptional,
    bool IsApproved,
    decimal LineTotal
);
