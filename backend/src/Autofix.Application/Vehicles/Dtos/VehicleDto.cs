namespace Autofix.Application.Vehicles.Dtos;

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
