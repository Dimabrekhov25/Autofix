namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Vehicle details included in a booking quote response.
/// </summary>
public sealed record BookingQuoteVehicleDto(
    Guid Id,
    string LicensePlate,
    string Vin,
    string Make,
    string Model,
    int Year,
    string? Trim,
    string? Engine
);
