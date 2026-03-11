using Autofix.Application.Vehicles.Dtos;
using Autofix.Application.Vehicles.Repositories;
using Autofix.Domain.Entities.Vehicles;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.CreateVehicle;

public sealed class CreateVehicleHandler(IVehicleRepository repository)
    : IRequestHandler<CreateVehicleCommand, VehicleDto>
{
    public async Task<VehicleDto> Handle(CreateVehicleCommand request, CancellationToken cancellationToken)
    {
        var vehicle = new Vehicle
        {
            OwnerCustomerId = request.OwnerCustomerId,
            LicensePlate = request.LicensePlate,
            Make = request.Make,
            Model = request.Model,
            Year = request.Year,
            IsDrivable = request.IsDrivable
        };

        var saved = await repository.AddAsync(vehicle, cancellationToken);

        return new VehicleDto(
            saved.Id,
            saved.OwnerCustomerId,
            saved.LicensePlate,
            saved.Make,
            saved.Model,
            saved.Year,
            saved.IsDrivable
        );
    }
}
