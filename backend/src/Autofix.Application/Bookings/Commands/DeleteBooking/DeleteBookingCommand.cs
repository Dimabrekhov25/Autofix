using MediatR;

namespace Autofix.Application.Bookings.Commands.DeleteBooking;

public sealed record DeleteBookingCommand(Guid Id) : IRequest<bool>;
