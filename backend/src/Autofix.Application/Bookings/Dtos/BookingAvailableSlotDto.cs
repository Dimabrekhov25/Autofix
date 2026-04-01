namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingAvailableSlotDto(
    Guid Id,
    DateTime StartAt,
    DateTime EndAt,
    string Label,
    bool IsAvailable,
    int OverlappingBookings
);
