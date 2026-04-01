namespace Autofix.Application.Vehicles.Dtos;

public sealed record VinDecodeResultDto(
    string Vin,
    bool MatchedExistingVehicle,
    string? Make,
    string? Model,
    int? Year,
    string? Trim,
    string? Engine
);
