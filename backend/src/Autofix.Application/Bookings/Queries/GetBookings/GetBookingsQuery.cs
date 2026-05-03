using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetBookings;

/// <summary>
/// Lists bookings, optionally filtered by customer and/or vehicle.
/// </summary>
public sealed record GetBookingsQuery(
    Guid? CustomerId = null,
    Guid? VehicleId = null) : IRequest<IReadOnlyList<BookingDto>>;
