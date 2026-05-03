using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.UpdateVehicle;

/// <summary>
/// Updates an existing vehicle's owner, identifiers, and specification fields.
/// </summary>
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
