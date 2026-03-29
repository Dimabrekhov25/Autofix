using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingDto(
    Guid Id,
    Guid CustomerId,
    Guid VehicleId,
    DateTime StartAt,
    DateTime EndAt,
    BookingStatus Status,
    IReadOnlyList<BookingServiceItemDto> Services
);
