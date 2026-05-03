namespace Autofix.Application.Statistics.Dtos;

/// <summary>
/// Comprehensive statistics dashboard combining all metrics.
/// </summary>
public sealed record ComprehensiveStatisticsDto(
    DateTime GeneratedAt,
    RevenueStatisticsDto Revenue,
    OrderStatisticsDto Orders,
    ServiceStatisticsDto Services,
    InventoryStatisticsDto Inventory,
    CustomerStatisticsDto Customers,
    EmployeeStatisticsDto Employees
);
