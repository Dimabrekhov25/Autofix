using Autofix.Domain.Common;
using Autofix.Domain.Entities.Inventory;

namespace Autofix.Domain.Entities.Catalog;

public sealed class ServiceCatalogPartRequirement : BaseEntity
{
    public Guid ServiceCatalogItemId { get; set; }
    public ServiceCatalogItem? ServiceCatalogItem { get; set; }
    public Guid PartId { get; set; }
    public Part? Part { get; set; }
    public int Quantity { get; set; }
}
