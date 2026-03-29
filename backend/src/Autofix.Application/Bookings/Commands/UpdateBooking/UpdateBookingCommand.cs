using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBooking;

public sealed record UpdateBookingCommand(
    Guid Id,
    Guid CustomerId,
    Guid VehicleId,
    DateTime StartAt,
    DateTime EndAt,
    BookingStatus Status,
    IReadOnlyList<Guid>? ServiceCatalogItemIds
) : IRequest<BookingDto?>;
