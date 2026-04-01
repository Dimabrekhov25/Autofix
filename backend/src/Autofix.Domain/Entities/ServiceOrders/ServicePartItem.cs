using Autofix.Domain.Common;
using Autofix.Domain.Entities.Inventory;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.ServiceOrders;

public sealed class ServicePartItem : BaseEntity
{
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder? ServiceOrder { get; set; }
    public Guid PartId { get; set; }
    public Part? Part { get; set; }
    public string PartName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public PartAvailability Availability { get; set; }
    public bool IsApproved { get; set; }
}
