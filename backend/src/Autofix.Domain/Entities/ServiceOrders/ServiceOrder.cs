using Autofix.Domain.Common;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.People;
using Autofix.Domain.Entities.Vehicles;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.ServiceOrders;

public sealed class ServiceOrder : BaseEntity
{
    public Guid BookingId { get; set; }
    public Booking.Booking? Booking { get; set; }
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public Guid VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public Guid? MechanicId { get; set; }
    public Employee? Mechanic { get; set; }
    public ServiceOrderStatus Status { get; set; } = ServiceOrderStatus.Pending;
    public DateTime? CustomerApprovedAt { get; set; }
    public DateTime? CustomerApprovalNotificationReadAt { get; set; }
    public decimal EstimatedLaborCost { get; set; }
    public decimal EstimatedPartsCost { get; set; }
    public decimal EstimatedTotalCost { get; set; }
    public List<DiagnosisItem> DiagnosisItems { get; set; } = new();
    public List<ServiceWorkItem> WorkItems { get; set; } = new();
    public List<ServicePartItem> PartItems { get; set; } = new();
}
