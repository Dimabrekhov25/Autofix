namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingVehicleDto(
    Guid Id,
    string LicensePlate,
    string? Vin,
    string Make,
    string Model,
    int Year,
    string? Trim,
    string? Engine,
    bool IsDrivable
);
