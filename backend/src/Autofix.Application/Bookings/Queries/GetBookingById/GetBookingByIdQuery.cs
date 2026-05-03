using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetBookingById;

/// <summary>
/// Fetches a single booking by id; <c>null</c> in the handler means not found.
/// </summary>
public sealed record GetBookingByIdQuery(Guid Id) : IRequest<BookingDto?>;
