using Autofix.Application.Common.Interfaces;
using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.UpdateVehicle;

public sealed class UpdateVehicleHandler(IVehicleRepository repository)
    : IRequestHandler<UpdateVehicleCommand, VehicleDto?>
{
    public async Task<VehicleDto?> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
    {
        var vehicle = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (vehicle is null)
        {
            return null;
        }

        vehicle.OwnerCustomerId = request.OwnerCustomerId;
        vehicle.LicensePlate = request.LicensePlate;
        vehicle.Make = request.Make;
        vehicle.Model = request.Model;
        vehicle.Year = request.Year;
        vehicle.IsDrivable = request.IsDrivable;
        vehicle.UpdatedAt = DateTime.UtcNow;

        await repository.UpdateAsync(vehicle, cancellationToken);

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
