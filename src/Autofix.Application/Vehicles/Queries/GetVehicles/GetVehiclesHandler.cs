using Autofix.Application.Vehicles.Dtos;
using Autofix.Application.Vehicles.Repositories;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.GetVehicles;

public sealed class GetVehiclesHandler(IVehicleRepository repository)
    : IRequestHandler<GetVehiclesQuery, IReadOnlyList<VehicleDto>>
{
    public async Task<IReadOnlyList<VehicleDto>> Handle(GetVehiclesQuery request, CancellationToken cancellationToken)
    {
        var vehicles = await repository.GetAllAsync(cancellationToken);
        return vehicles
            .Select(vehicle => new VehicleDto(
                vehicle.Id,
                vehicle.OwnerCustomerId,
                vehicle.LicensePlate,
                vehicle.Make,
                vehicle.Model,
                vehicle.Year,
                vehicle.IsDrivable
            ))
            .ToList();
    }
}
