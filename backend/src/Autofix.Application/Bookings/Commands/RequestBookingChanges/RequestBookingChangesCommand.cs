using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Commands.RequestBookingChanges;

public sealed record RequestBookingChangesCommand(Guid Id) : IRequest<BookingDto?>;
