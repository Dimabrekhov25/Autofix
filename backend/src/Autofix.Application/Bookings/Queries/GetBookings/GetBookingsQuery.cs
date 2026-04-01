using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetBookings;

public sealed record GetBookingsQuery(
    Guid? CustomerId = null,
    Guid? VehicleId = null) : IRequest<IReadOnlyList<BookingDto>>;
