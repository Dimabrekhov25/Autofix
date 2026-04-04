using Autofix.Domain.Common;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.Catalog;

public sealed class ServiceCatalogItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ServiceCatalogCategory Category { get; set; } = ServiceCatalogCategory.Service;
    public decimal BasePrice { get; set; }
    public decimal EstimatedLaborCost { get; set; }
    public TimeSpan EstimatedDuration { get; set; }
    public bool IsActive { get; set; } = true;
    public List<ServiceCatalogPartRequirement> RequiredParts { get; set; } = new();
}
