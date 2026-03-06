using Autofix.Domain.Common;

namespace Autofix.Domain.Entities.Catalog;

public sealed class ServiceCatalogItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public TimeSpan EstimatedDuration { get; set; }
    public bool IsActive { get; set; } = true;
}
