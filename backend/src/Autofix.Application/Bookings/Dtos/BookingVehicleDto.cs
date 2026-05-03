namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Vehicle snapshot shown on a booking (identity and descriptive fields for the customer’s car).
/// </summary>
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
