using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetCurrentUserBookings;

public sealed record GetCurrentUserBookingsQuery : IRequest<IReadOnlyList<BookingDto>>;
