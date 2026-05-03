namespace Autofix.Application.Statistics.Dtos;

public class RevenueStatisticsDto
{
    public decimal TotalRevenue { get; set; }
    public decimal LaborRevenue { get; set; }
    public decimal PartsRevenue { get; set; }
    public decimal DiscountsTotal { get; set; }
    public decimal TaxesTotal { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<MonthlyRevenueDto> MonthlyBreakdown { get; set; } = new();
}

public class MonthlyRevenueDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}
