using Autofix.Domain.Common;

namespace Autofix.Domain.Entities.Inventory;

public sealed class Part : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public bool IsActive { get; set; } = true;
}
