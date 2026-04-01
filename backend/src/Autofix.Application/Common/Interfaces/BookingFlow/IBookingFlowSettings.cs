namespace Autofix.Application.Common.Interfaces.BookingFlow;

public interface IBookingFlowSettings
{
    TimeSpan WorkshopDayStart { get; }
    TimeSpan WorkshopDayEnd { get; }
    int SlotIntervalMinutes { get; }
    int BufferMinutes { get; }
    int MaxConcurrentBookings { get; }
    decimal DefaultTaxRate { get; }
    string Currency { get; }
}
