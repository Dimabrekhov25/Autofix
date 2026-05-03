namespace Autofix.Application.Statistics.Dtos;

public class PartStatisticsDto
{
    public Guid PartId { get; set; }
    public string PartName { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public decimal TotalCost { get; set; }
    public decimal AveragePrice { get; set; }
}
