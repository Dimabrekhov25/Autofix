using Autofix.Application.Statistics.Dtos;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetComprehensiveStatistics;

public sealed record GetComprehensiveStatisticsQuery(DateTime? StartDate = null, DateTime? EndDate = null) 
    : IRequest<ComprehensiveStatisticsDto>;
