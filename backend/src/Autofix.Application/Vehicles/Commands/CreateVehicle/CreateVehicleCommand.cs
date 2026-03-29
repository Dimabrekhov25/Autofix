using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.CreateVehicle;

public sealed record CreateVehicleCommand(
    Guid OwnerCustomerId,
    string LicensePlate,
    string Make,
    string Model,
    int Year,
    bool IsDrivable
) : IRequest<VehicleDto>;
