using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBookingServiceOrderStatus;

/// <summary>
/// Admin-style command: advance the service order tied to a booking by status (workflow entry point from API).
/// </summary>
public sealed record UpdateBookingServiceOrderStatusCommand(
    Guid Id,
    ServiceOrderStatus Status) : IRequest<BookingDto?>;
