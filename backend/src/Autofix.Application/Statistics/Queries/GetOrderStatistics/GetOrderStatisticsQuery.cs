using Autofix.Application.Statistics.Dtos;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetOrderStatistics;

public sealed record GetOrderStatisticsQuery(DateTime? StartDate = null, DateTime? EndDate = null) 
    : IRequest<OrderStatisticsDto>;
