using Autofix.Application.Statistics.Dtos;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetVehicleStatistics;

public sealed record GetVehicleStatisticsQuery 
    : IRequest<VehicleStatisticsDto>;
