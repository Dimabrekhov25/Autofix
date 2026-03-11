using Autofix.Application.Vehicles.Dtos;
using Autofix.Application.Vehicles.Repositories;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.GetVehicleById;

public sealed class GetVehicleByIdHandler(IVehicleRepository repository)
    : IRequestHandler<GetVehicleByIdQuery, VehicleDto?>
{
    public async Task<VehicleDto?> Handle(GetVehicleByIdQuery request, CancellationToken cancellationToken)
    {
        var vehicle = await repository.GetByIdAsync(request.Id, cancellationToken);
        if (vehicle is null)
        {
            return null;
        }

        return new VehicleDto(
            vehicle.Id,
            vehicle.OwnerCustomerId,
            vehicle.LicensePlate,
            vehicle.Make,
            vehicle.Model,
            vehicle.Year,
            vehicle.IsDrivable
        );
    }
}
