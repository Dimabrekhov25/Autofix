namespace Autofix.Application.Statistics.Dtos;

/// <summary>
/// Statistics about individual mechanic/employee performance.
/// </summary>
public sealed record EmployeeStatisticItemDto(
    Guid EmployeeId,
    string EmployeeName,
    int CompletedJobs,
    decimal TotalLaborHours,
    decimal AverageJobsPerDay,
    decimal AverageJobValue
);

/// <summary>
/// Overall employee and team statistics.
/// </summary>
public sealed record EmployeeStatisticsDto(
    int TotalEmployees,
    int ActiveEmployees,
    int TotalJobsCompleted,
    decimal AverageJobsPerEmployee,
    decimal TotalTeamLaborHours,
    IReadOnlyList<EmployeeStatisticItemDto> TopPerformers
);
