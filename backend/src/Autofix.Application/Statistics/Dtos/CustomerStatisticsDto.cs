namespace Autofix.Application.Statistics.Dtos;

/// <summary>
/// Customer-related statistics for admin dashboard.
/// </summary>
public sealed record CustomerStatisticsDto(
    int TotalCustomers,
    int ActiveCustomers,
    int NewCustomersThisMonth,
    decimal CustomerRetentionRate,
    decimal AverageCustomerLifetimeValue,
    int TotalBookings,
    decimal AverageBookingValue
);
