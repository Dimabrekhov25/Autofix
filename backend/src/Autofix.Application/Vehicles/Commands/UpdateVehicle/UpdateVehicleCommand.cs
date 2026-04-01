using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.UpdateVehicle;

public sealed record UpdateVehicleCommand(
    Guid Id,
    Guid OwnerCustomerId,
    string LicensePlate,
    string Vin,
    string Make,
    string Model,
    int Year,
    string? Trim,
    string? Engine,
    bool IsDrivable
) : IRequest<VehicleDto?>;
