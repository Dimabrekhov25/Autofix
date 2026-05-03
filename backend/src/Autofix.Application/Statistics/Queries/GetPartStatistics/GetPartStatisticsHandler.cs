using Autofix.Application.Common.Interfaces;
using Autofix.Application.Statistics.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetPartStatistics;

public sealed class GetPartStatisticsHandler(IServiceOrderRepository serviceOrderRepository) 
    : IRequestHandler<GetPartStatisticsQuery, List<PartStatisticsDto>>
{
    public async Task<List<PartStatisticsDto>> Handle(GetPartStatisticsQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddMonths(-12);
        var endDate = request.EndDate ?? DateTime.UtcNow;
        var topCount = request.TopCount ?? 10;

        var orders = await serviceOrderRepository.GetAllAsync(cancellationToken);

        var filteredOrders = orders
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate && o.Status == ServiceOrderStatus.Completed)
            .ToList();

        var partStats = filteredOrders
            .SelectMany(o => o.PartItems, (order, partItem) => new { order, partItem })
            .GroupBy(x => new { x.partItem.PartId, x.partItem.PartName })
            .Select(g => new PartStatisticsDto
            {
                PartId = g.Key.PartId,
                PartName = g.Key.PartName,
                UsageCount = g.Count(),
                TotalCost = g.Sum(x => x.partItem.UnitPrice * x.partItem.Quantity),
                AveragePrice = g.Average(x => x.partItem.UnitPrice * x.partItem.Quantity)
            })
            .OrderByDescending(p => p.UsageCount)
            .Take(topCount)
            .ToList();

        return partStats;
    }
}
