namespace Autofix.Application.Parts.Dtos;

/// <summary>
/// Part read model (name, unit price, and active flag).
/// </summary>
public sealed record PartDto(
    Guid Id,
    string Name,
    decimal UnitPrice,
    bool IsActive
);
