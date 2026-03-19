namespace Autofix.Application.Parts.Dtos;

public sealed record PartDto(
    Guid Id,
    string Name,
    decimal UnitPrice,
    bool IsActive
);