using Autofix.Application.Statistics.Dtos;
using Autofix.Application.Statistics.Queries.GetOrderStatistics;
using Autofix.Application.Statistics.Queries.GetRevenueStatistics;
using Autofix.Application.Statistics.Queries.GetVehicleStatistics;
using Autofix.Application.Statistics.Queries.GetServiceStatistics;
using Autofix.Application.Statistics.Queries.GetPartStatistics;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetComprehensiveStatistics;

public sealed class GetComprehensiveStatisticsHandler(IMediator mediator) 
    : IRequestHandler<GetComprehensiveStatisticsQuery, ComprehensiveStatisticsDto>
{
    public async Task<ComprehensiveStatisticsDto> Handle(GetComprehensiveStatisticsQuery request, CancellationToken cancellationToken)
    {
        var orderStats = await mediator.Send(
            new GetOrderStatisticsQuery(request.StartDate, request.EndDate), 
            cancellationToken);
        
        var revenueStats = await mediator.Send(
            new GetRevenueStatisticsQuery(request.StartDate, request.EndDate), 
            cancellationToken);
        
        var vehicleStats = await mediator.Send(
            new GetVehicleStatisticsQuery(), 
            cancellationToken);
        
        var topServices = await mediator.Send(
            new GetServiceStatisticsQuery(request.StartDate, request.EndDate, 10), 
            cancellationToken);
        
        var topParts = await mediator.Send(
            new GetPartStatisticsQuery(request.StartDate, request.EndDate, 10), 
            cancellationToken);

        return new ComprehensiveStatisticsDto
        {
            OrderStatistics = orderStats,
            RevenueStatistics = revenueStats,
            VehicleStatistics = vehicleStats,
            TopServices = topServices,
            TopParts = topParts
        };
    }
}
