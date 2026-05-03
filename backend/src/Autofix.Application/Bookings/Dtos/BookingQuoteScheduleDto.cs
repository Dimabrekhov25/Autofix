namespace Autofix.Application.Bookings.Dtos;

/// <summary>
/// Proposed appointment window and total duration for a quote.
/// </summary>
public sealed record BookingQuoteScheduleDto(
    DateTime StartAt,
    DateTime EndAt,
    TimeSpan TotalDuration
);
