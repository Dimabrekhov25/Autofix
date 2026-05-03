namespace Autofix.Application.Statistics.Dtos;

public class ComprehensiveStatisticsDto
{
    public OrderStatisticsDto OrderStatistics { get; set; } = new();
    public RevenueStatisticsDto RevenueStatistics { get; set; } = new();
    public VehicleStatisticsDto VehicleStatistics { get; set; } = new();
    public List<ServiceStatisticsDto> TopServices { get; set; } = new();
    public List<PartStatisticsDto> TopParts { get; set; } = new();
}
