using Autofix.Domain.Common;
using Autofix.Domain.Entities.ServiceOrders;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.Finance;

public sealed class Invoice : BaseEntity
{
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder? ServiceOrder { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;
    public decimal Subtotal { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public List<InvoiceLineItem> LineItems { get; set; } = new();
}
