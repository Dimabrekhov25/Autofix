namespace Autofix.Application.Statistics.Dtos;

/// <summary>
/// Statistics about individual services: popularity, revenue, and utilization.
/// </summary>
public sealed record ServiceStatisticItemDto(
    Guid ServiceId,
    string ServiceName,
    int TimesRequested,
    decimal TotalRevenue,
    decimal AveragePrice
);

/// <summary>
/// Top services and overall service statistics.
/// </summary>
public sealed record ServiceStatisticsDto(
    int TotalUniqueServices,
    int ServicesRequested,
    IReadOnlyList<ServiceStatisticItemDto> TopServices
);
