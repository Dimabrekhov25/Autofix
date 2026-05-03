using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.CreateVehicle;

/// <summary>
/// Registers a vehicle for a customer with identification and specification fields.
/// </summary>
public sealed record CreateVehicleCommand(
    Guid OwnerCustomerId,
    string LicensePlate,
    string Vin,
    string Make,
    string Model,
    int Year,
    string? Trim,
    string? Engine,
    bool IsDrivable
) : IRequest<VehicleDto>;
