namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingEstimateWorkItemDto(
    Guid Id,
    string Description,
    decimal LaborHours,
    decimal HourlyRate,
    decimal LineTotal
);
