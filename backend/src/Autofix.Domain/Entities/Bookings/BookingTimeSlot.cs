using Autofix.Domain.Common;

namespace Autofix.Domain.Entities.Booking;

public sealed class BookingTimeSlot : BaseEntity
{
    public DateTime StartAt { get; set; }
    public string Label { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public List<Booking> Bookings { get; set; } = new();
}
