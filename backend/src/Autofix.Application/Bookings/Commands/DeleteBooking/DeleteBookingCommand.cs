using MediatR;

namespace Autofix.Application.Bookings.Commands.DeleteBooking;

/// <summary>
/// MediatR command to delete a booking by id; returns whether a row was removed.
/// </summary>
public sealed record DeleteBookingCommand(Guid Id) : IRequest<bool>;
