using Autofix.Application.Common.Interfaces.BookingFlow;
using Microsoft.Extensions.Options;

namespace Autofix.Infrastructure.Options;

public sealed class BookingFlowSettings(IOptions<BookingFlowOptions> options) : IBookingFlowSettings
{
    private readonly BookingFlowOptions _value = options.Value;

    public TimeSpan WorkshopDayStart => _value.WorkshopDayStart;
    public TimeSpan WorkshopDayEnd => _value.WorkshopDayEnd;
    public int SlotIntervalMinutes => _value.SlotIntervalMinutes;
    public int BufferMinutes => _value.BufferMinutes;
    public int MaxConcurrentBookings => _value.MaxConcurrentBookings;
    public decimal DefaultTaxRate => _value.DefaultTaxRate;
    public string Currency => _value.Currency;
}
