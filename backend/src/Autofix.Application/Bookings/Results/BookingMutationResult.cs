using Autofix.Application.Bookings.Dtos;

namespace Autofix.Application.Bookings.Results;

public sealed record BookingMutationResult(
    BookingDto? Booking,
    BookingMutationError Error = BookingMutationError.None
);
