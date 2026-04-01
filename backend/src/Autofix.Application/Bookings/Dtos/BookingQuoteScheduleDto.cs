namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingQuoteScheduleDto(
    DateTime StartAt,
    DateTime EndAt,
    TimeSpan TotalDuration
);
