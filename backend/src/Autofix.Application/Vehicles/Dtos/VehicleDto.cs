namespace Autofix.Application.Vehicles.Dtos;

/// <summary>
/// Vehicle read model (owner, plate, VIN, make/model/year, and drivable flag).
/// </summary>
public sealed record VehicleDto(
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
);
