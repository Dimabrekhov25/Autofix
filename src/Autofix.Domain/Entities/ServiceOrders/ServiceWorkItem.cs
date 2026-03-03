using Autofix.Domain.Common;

namespace Autofix.Domain.Entities.ServiceOrders;

public sealed class ServiceWorkItem : BaseEntity
{
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder? ServiceOrder { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal LaborHours { get; set; }
    public decimal HourlyRate { get; set; }
    public bool IsOptional { get; set; }
    public bool IsApproved { get; set; }
}
