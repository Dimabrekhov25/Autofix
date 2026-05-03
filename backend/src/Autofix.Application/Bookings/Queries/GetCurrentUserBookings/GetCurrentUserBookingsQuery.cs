using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetCurrentUserBookings;

/// <summary>
/// Lists bookings for the authenticated customer (empty list if no customer profile).
/// </summary>
public sealed record GetCurrentUserBookingsQuery : IRequest<IReadOnlyList<BookingDto>>;
