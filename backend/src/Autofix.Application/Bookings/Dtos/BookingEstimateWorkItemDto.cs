namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Labor line on an estimate with hours, rate, and computed line total.
/// </summary>
public sealed record BookingEstimateWorkItemDto(
    Guid Id,
    string Description,
    decimal LaborHours,
    decimal HourlyRate,
    decimal LineTotal
);
