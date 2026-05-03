namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// A single bookable window: slot id, start/end, display label, availability, and overlap hint for diagnostics or UI.
/// </summary>
public sealed record BookingAvailableSlotDto(
    Guid Id,
    DateTime StartAt,
    DateTime EndAt,
    string Label,
    bool IsAvailable,
    int OverlappingBookings
);
