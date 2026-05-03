using Autofix.Application.Common.Interfaces;
using Autofix.Application.Statistics.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetServiceStatistics;

public sealed class GetServiceStatisticsHandler(IServiceOrderRepository serviceOrderRepository) 
    : IRequestHandler<GetServiceStatisticsQuery, List<ServiceStatisticsDto>>
{
    public async Task<List<ServiceStatisticsDto>> Handle(GetServiceStatisticsQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddMonths(-12);
        var endDate = request.EndDate ?? DateTime.UtcNow;
        var topCount = request.TopCount ?? 10;

        var orders = await serviceOrderRepository.GetAllAsync(cancellationToken);

        var filteredOrders = orders
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate && o.Status == ServiceOrderStatus.Completed)
            .ToList();

        var serviceStats = filteredOrders
            .SelectMany(o => o.WorkItems, (order, workItem) => new { order, workItem })
            .GroupBy(x => x.workItem.Description)
            .Select(g => new ServiceStatisticsDto
            {
                ServiceId = Guid.Empty, // Service ID not available in WorkItem
                ServiceName = g.Key,
                UsageCount = g.Count(),
                TotalRevenue = g.Sum(x => x.workItem.LaborHours * x.workItem.HourlyRate),
                AveragePrice = g.Average(x => x.workItem.LaborHours * x.workItem.HourlyRate)
            })
            .OrderByDescending(s => s.UsageCount)
            .Take(topCount)
            .ToList();

        return serviceStats;
    }
}
