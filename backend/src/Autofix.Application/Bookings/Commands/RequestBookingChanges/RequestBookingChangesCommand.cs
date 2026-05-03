using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Commands.RequestBookingChanges;

/// <summary>
/// Customer requests changes to the estimate; represented as a service-order status move.
/// </summary>
public sealed record RequestBookingChangesCommand(Guid Id) : IRequest<BookingDto?>;
