using Autofix.Application.Vehicles.Dtos;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Vehicles;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.CreateVehicle;

public sealed class CreateVehicleHandler(
    IVehicleRepository repository)
    : IRequestHandler<CreateVehicleCommand, VehicleDto>
{
    public async Task<VehicleDto> Handle(CreateVehicleCommand request, CancellationToken cancellationToken)
    {
        // Input normalization keeps VIN/optional fields consistent at write boundary.
        var vehicle = new Vehicle
        {
            OwnerCustomerId = request.OwnerCustomerId,
            LicensePlate = request.LicensePlate,
            Vin = request.Vin.Trim().ToUpperInvariant(),
            Make = request.Make,
            Model = request.Model,
            Year = request.Year,
            Trim = string.IsNullOrWhiteSpace(request.Trim) ? null : request.Trim.Trim(),
            Engine = string.IsNullOrWhiteSpace(request.Engine) ? null : request.Engine.Trim(),
            IsDrivable = request.IsDrivable
        };

        // Repository assigns identity and persistence metadata before projection.
        var saved = await repository.AddAsync(vehicle, cancellationToken);
        
        return new VehicleDto(
            saved.Id,
            saved.OwnerCustomerId,
            saved.LicensePlate,
            saved.Vin ?? string.Empty,
            saved.Make,
            saved.Model,
            saved.Year,
            saved.Trim,
            saved.Engine,
            saved.IsDrivable
        );
    }
}
