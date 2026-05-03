namespace Autofix.Application.Vehicles.Dtos;

/// <summary>
/// VIN decode response including whether a matching vehicle exists and optional specs.
/// </summary>
public sealed record VinDecodeResultDto(
    string Vin,
    bool MatchedExistingVehicle,
    string? Make,
    string? Model,
    int? Year,
    string? Trim,
    string? Engine
);
