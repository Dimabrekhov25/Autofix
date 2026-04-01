namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingAvailableSlotsDto(
    DateTime Date,
    TimeSpan TotalDuration,
    IReadOnlyList<BookingAvailableSlotDto> Slots
);
