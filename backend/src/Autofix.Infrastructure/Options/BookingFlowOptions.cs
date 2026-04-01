namespace Autofix.Infrastructure.Options;

public sealed class BookingFlowOptions
{
    public const string SectionName = "BookingFlow";

    public TimeSpan WorkshopDayStart { get; set; } = new(8, 0, 0);
    public TimeSpan WorkshopDayEnd { get; set; } = new(18, 0, 0);
    public int SlotIntervalMinutes { get; set; } = 45;
    public int BufferMinutes { get; set; } = 15;
    public int MaxConcurrentBookings { get; set; } = 4;
    public decimal DefaultTaxRate { get; set; }
    public string Currency { get; set; } = "USD";
}
