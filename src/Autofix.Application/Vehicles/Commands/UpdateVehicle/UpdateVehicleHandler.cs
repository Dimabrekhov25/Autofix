using Autofix.Application.Common.Interfaces;
using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.UpdateVehicle;

public sealed class UpdateVehicleHandler(IVehicleRepository repository)
    : IRequestHandler<UpdateVehicleCommand, VehicleDto?>
{
    public async Task<VehicleDto?> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
    {
        var updated = await repository.UpdateAsync(
            request.Id,
            request.OwnerCustomerId,
            request.LicensePlate,
            request.Make,
            request.Model,
            request.Year,
            request.IsDrivable,
            cancellationToken);

        if (updated is null)
        {
            return null;
        }

        return new VehicleDto(
            updated.Id,
            updated.OwnerCustomerId,
            updated.LicensePlate,
            updated.Make,
            updated.Model,
            updated.Year,
            updated.IsDrivable
        );
    }
}
