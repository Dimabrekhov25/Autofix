using Autofix.Application.Common.Interfaces;
using Autofix.Application.Statistics.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetOrderStatistics;

public sealed class GetOrderStatisticsHandler(IServiceOrderRepository repository) 
    : IRequestHandler<GetOrderStatisticsQuery, OrderStatisticsDto>
{
    public async Task<OrderStatisticsDto> Handle(GetOrderStatisticsQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddMonths(-1);
        var endDate = request.EndDate ?? DateTime.UtcNow;

        var orders = await repository.GetAllAsync(cancellationToken);
        
        var filteredOrders = orders
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
            .ToList();

        var totalOrders = filteredOrders.Count;
        var completedOrders = filteredOrders.Count(o => o.Status == ServiceOrderStatus.Completed);
        var pendingOrders = filteredOrders.Count(o => o.Status == ServiceOrderStatus.Pending);
        var cancelledOrders = filteredOrders.Count(o => o.Status == ServiceOrderStatus.Cancelled);
        
        var totalRevenue = filteredOrders.Sum(o => o.EstimatedTotalCost);
        var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return new OrderStatisticsDto
        {
            TotalOrders = totalOrders,
            CompletedOrders = completedOrders,
            PendingOrders = pendingOrders,
            CancelledOrders = cancelledOrders,
            TotalRevenue = totalRevenue,
            AverageOrderValue = averageOrderValue,
            StartDate = startDate,
            EndDate = endDate
        };
    }
}
