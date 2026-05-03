namespace Autofix.Application.Statistics.Dtos;

/// <summary>
/// Revenue statistics for admin dashboard showing financial performance.
/// </summary>
public sealed record RevenueStatisticsDto(
    decimal TotalRevenue,
    decimal TotalLaborCost,
    decimal TotalPartsCost,
    decimal AverageOrderValue,
    int CompletedOrders,
    decimal RevenueTrend
);
