using Autofix.Application.Common.Interfaces;
using Autofix.Application.Statistics.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetRevenueStatistics;

public sealed class GetRevenueStatisticsHandler(IServiceOrderRepository serviceOrderRepository) 
    : IRequestHandler<GetRevenueStatisticsQuery, RevenueStatisticsDto>
{
    public async Task<RevenueStatisticsDto> Handle(GetRevenueStatisticsQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddMonths(-12);
        var endDate = request.EndDate ?? DateTime.UtcNow;

        var orders = await serviceOrderRepository.GetAllAsync(cancellationToken);
        
        var filteredOrders = orders
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate && o.Status == ServiceOrderStatus.Completed)
            .ToList();

        var laborRevenue = filteredOrders.Sum(o => o.EstimatedLaborCost);
        var partsRevenue = filteredOrders.Sum(o => o.EstimatedPartsCost);
        var totalRevenue = laborRevenue + partsRevenue;

        // Group by month
        var monthlyBreakdown = filteredOrders
            .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
            .Select(g => new MonthlyRevenueDto
            {
                Month = g.Key.Month,
                Year = g.Key.Year,
                Revenue = g.Sum(o => o.EstimatedTotalCost),
                OrderCount = g.Count()
            })
            .OrderBy(m => m.Year)
            .ThenBy(m => m.Month)
            .ToList();

        return new RevenueStatisticsDto
        {
            TotalRevenue = totalRevenue,
            LaborRevenue = laborRevenue,
            PartsRevenue = partsRevenue,
            DiscountsTotal = 0, // Will be populated from invoices if available
            TaxesTotal = 0,
            StartDate = startDate,
            EndDate = endDate,
            MonthlyBreakdown = monthlyBreakdown
        };
    }
}
