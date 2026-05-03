namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Available time slots for a given calendar date and required total duration.
/// </summary>
public sealed record BookingAvailableSlotsDto(
    DateTime Date,
    TimeSpan TotalDuration,
    IReadOnlyList<BookingAvailableSlotDto> Slots
);
