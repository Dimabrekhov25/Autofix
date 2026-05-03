namespace Autofix.Application.Common.Interfaces.BookingFlow;

/// <summary>
/// Configurable booking rules: shop hours, slot grid, buffers, concurrency, tax, and currency.
/// </summary>
public interface IBookingFlowSettings
{
    /// <summary>Start of the workshop day (time-of-day).</summary>
    TimeSpan WorkshopDayStart { get; }
    /// <summary>End of the workshop day (time-of-day).</summary>
    TimeSpan WorkshopDayEnd { get; }
    /// <summary>Spacing between slot starts in minutes.</summary>
    int SlotIntervalMinutes { get; }
    /// <summary>Extra minutes added after services when computing booking end time.</summary>
    int BufferMinutes { get; }
    /// <summary>Maximum overlapping bookings allowed in the same interval.</summary>
    int MaxConcurrentBookings { get; }
    /// <summary>Tax rate applied to subtotal + labor for estimates (e.g. 0.08m for 8%).</summary>
    decimal DefaultTaxRate { get; }
    /// <summary>ISO currency code for pricing display and persistence.</summary>
    string Currency { get; }
}
