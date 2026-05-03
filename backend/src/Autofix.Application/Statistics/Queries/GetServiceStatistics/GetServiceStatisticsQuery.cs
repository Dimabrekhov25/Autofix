using Autofix.Application.Statistics.Dtos;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetServiceStatistics;

public sealed record GetServiceStatisticsQuery(DateTime? StartDate = null, DateTime? EndDate = null, int? TopCount = 10) 
    : IRequest<List<ServiceStatisticsDto>>;
