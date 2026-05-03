namespace Autofix.Application.Statistics.Dtos;

public class ServiceStatisticsDto
{
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AveragePrice { get; set; }
}
