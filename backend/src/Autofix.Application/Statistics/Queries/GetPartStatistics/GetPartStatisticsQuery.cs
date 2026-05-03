using Autofix.Application.Statistics.Dtos;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetPartStatistics;

public sealed record GetPartStatisticsQuery(DateTime? StartDate = null, DateTime? EndDate = null, int? TopCount = 10) 
    : IRequest<List<PartStatisticsDto>>;
