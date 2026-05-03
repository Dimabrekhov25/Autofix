using Autofix.Application.Common.Interfaces;
using Autofix.Application.Statistics.Dtos;
using MediatR;

namespace Autofix.Application.Statistics.Queries.GetVehicleStatistics;

public sealed class GetVehicleStatisticsHandler(IVehicleRepository repository) 
    : IRequestHandler<GetVehicleStatisticsQuery, VehicleStatisticsDto>
{
    public async Task<VehicleStatisticsDto> Handle(GetVehicleStatisticsQuery request, CancellationToken cancellationToken)
    {
        var vehicles = await repository.GetAllAsync(cancellationToken);
        
        var activeVehicles = vehicles.Count(v => !v.IsDeleted);
        var vehiclesByMake = vehicles
            .Where(v => !v.IsDeleted)
            .GroupBy(v => v.Make)
            .ToDictionary(g => g.Key, g => g.Count());
        
        var vehiclesByYear = vehicles
            .Where(v => !v.IsDeleted)
            .GroupBy(v => v.Year.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        return new VehicleStatisticsDto
        {
            TotalVehicles = vehicles.Count,
            ActiveVehicles = activeVehicles,
            VehiclesByMake = vehiclesByMake,
            VehiclesByYear = vehiclesByYear
        };
    }
}
