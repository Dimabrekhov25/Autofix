using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBookingServiceOrderStatus;

public sealed record UpdateBookingServiceOrderStatusCommand(
    Guid Id,
    ServiceOrderStatus Status) : IRequest<BookingDto?>;
