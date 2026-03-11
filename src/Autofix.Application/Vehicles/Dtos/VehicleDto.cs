namespace Autofix.Application.Vehicles.Dtos;

public sealed record VehicleDto(
    Guid Id,
    Guid OwnerCustomerId,
    string LicensePlate,
    string Make,
    string Model,
    int Year,
    bool IsDrivable
);
