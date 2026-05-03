namespace Autofix.Application.Statistics.Dtos;

/// <summary>
/// Statistics about inventory parts: stock levels and movement.
/// </summary>
public sealed record InventoryStatisticItemDto(
    Guid PartId,
    string PartName,
    int QuantityOnHand,
    int ReservedQuantity,
    int MinLevel,
    bool IsBelowMinimum
);

/// <summary>
/// Overall inventory statistics including low stock warnings.
/// </summary>
public sealed record InventoryStatisticsDto(
    int TotalParts,
    int PartsInStock,
    int PartsBelowMinimum,
    decimal TotalInventoryValue,
    IReadOnlyList<InventoryStatisticItemDto> LowStockParts
);
