using Autofix.Application.Vehicles.Dtos;
using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.GetVehicleById;

public sealed class GetVehicleByIdHandler(IVehicleRepository repository)
    : IRequestHandler<GetVehicleByIdQuery, VehicleDto?>
{
    public async Task<VehicleDto?> Handle(GetVehicleByIdQuery request, CancellationToken cancellationToken)
    {
        // Query follows "null when missing" contract for API-layer 404 mapping.
        var vehicle = await repository.GetByIdAsync(request.Id, cancellationToken);
        if (vehicle is null)
        {
            return null;
        }

        return new VehicleDto(
            vehicle.Id,
            vehicle.OwnerCustomerId,
            vehicle.LicensePlate,
            vehicle.Vin ?? string.Empty,
            vehicle.Make,
            vehicle.Model,
            vehicle.Year,
            vehicle.Trim,
            vehicle.Engine,
            vehicle.IsDrivable
        );
    }
}
