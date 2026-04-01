using Autofix.Domain.Common;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.Booking;

public sealed class BookingServiceItem : BaseEntity
{
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }
    public Guid ServiceCatalogItemId { get; set; }
    public ServiceCatalogItem? ServiceCatalogItem { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ServiceCatalogCategory Category { get; set; } = ServiceCatalogCategory.Service;
    public decimal BasePrice { get; set; }
    public decimal EstimatedLaborCost { get; set; }
    public TimeSpan EstimatedDuration { get; set; }
}
