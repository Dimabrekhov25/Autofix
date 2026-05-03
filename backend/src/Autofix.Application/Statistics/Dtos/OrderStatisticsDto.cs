namespace Autofix.Application.Statistics.Dtos;

/// <summary>
/// Order statistics showing booking and service order status breakdown.
/// </summary>
public sealed record OrderStatisticsDto(
    int TotalOrders,
    int PendingOrders,
    int ApprovedOrders,
    int InProgressOrders,
    int CompletedOrders,
    int CancelledOrders,
    decimal AverageProcessingTimeHours,
    decimal CompletionRate
);
