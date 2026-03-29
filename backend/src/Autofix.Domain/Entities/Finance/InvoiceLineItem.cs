using Autofix.Domain.Common;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.Finance;

public sealed class InvoiceLineItem : BaseEntity
{
    public Guid InvoiceId { get; set; }
    public Invoice? Invoice { get; set; }
    public InvoiceLineType LineType { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}
