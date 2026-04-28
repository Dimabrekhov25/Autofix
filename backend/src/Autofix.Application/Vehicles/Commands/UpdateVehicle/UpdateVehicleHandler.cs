using Autofix.Application.Common.Interfaces;
using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.UpdateVehicle;

public sealed class UpdateVehicleHandler(IVehicleRepository repository)
    : IRequestHandler<UpdateVehicleCommand, VehicleDto?>
{
    public async Task<VehicleDto?> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
    {
        // Update follows "null when missing" contract for absent vehicles.
        var vehicle = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (vehicle is null)
        {
            return null;
        }

        vehicle.OwnerCustomerId = request.OwnerCustomerId;
        vehicle.LicensePlate = request.LicensePlate;
        vehicle.Vin = request.Vin.Trim().ToUpperInvariant();
        vehicle.Make = request.Make;
        vehicle.Model = request.Model;
        vehicle.Year = request.Year;
        vehicle.Trim = string.IsNullOrWhiteSpace(request.Trim) ? null : request.Trim.Trim();
        vehicle.Engine = string.IsNullOrWhiteSpace(request.Engine) ? null : request.Engine.Trim();
        vehicle.IsDrivable = request.IsDrivable;
        vehicle.UpdatedAt = DateTime.UtcNow;

        // Repository persists changes; handler projects the updated aggregate back to DTO.
        await repository.UpdateAsync(vehicle, cancellationToken);

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
