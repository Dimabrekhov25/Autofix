using Autofix.Domain.Common;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.ServiceOrders;

public sealed class DiagnosisItem : BaseEntity
{
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder? ServiceOrder { get; set; }
    public string Description { get; set; } = string.Empty;
    public DiagnosisSeverity Severity { get; set; }
}
