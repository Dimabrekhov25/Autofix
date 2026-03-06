using Autofix.Domain.Common;

namespace Autofix.Domain.Entities.Inventory;

public sealed class InventoryItem : BaseEntity
{
    public Guid PartId { get; set; }
    public Part? Part { get; set; }
    public int QuantityOnHand { get; set; }
    public int ReservedQuantity { get; set; }
    public int MinLevel { get; set; }
}
