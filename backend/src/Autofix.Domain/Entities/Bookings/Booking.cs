using Autofix.Domain.Common;
using Autofix.Domain.Entities.People;
using Autofix.Domain.Entities.Vehicles;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.Booking;

public sealed class Booking : BaseEntity
{
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public Guid VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Created;
    public List<BookingServiceItem> Services { get; set; } = new();
}
