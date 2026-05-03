using Autofix.Application.Statistics.Dtos;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetRevenueStatistics;

public sealed record GetRevenueStatisticsQuery(DateTime? StartDate = null, DateTime? EndDate = null) 
    : IRequest<RevenueStatisticsDto>;
