using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.UpdateVehicle;

public sealed record UpdateVehicleCommand(
    Guid Id,
    Guid OwnerCustomerId,
    string LicensePlate,
    string Make,
    string Model,
    int Year,
    bool IsDrivable
) : IRequest<VehicleDto?>;
