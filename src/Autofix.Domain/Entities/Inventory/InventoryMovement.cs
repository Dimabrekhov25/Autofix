using Autofix.Domain.Common;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.Inventory;

public sealed class InventoryMovement : BaseEntity
{
    public Guid PartId { get; set; }
    public Part? Part { get; set; }
    public InventoryMovementType MovementType { get; set; }
    public int Quantity { get; set; }
    public string? Reason { get; set; }
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
}
