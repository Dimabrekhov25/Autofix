using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetBookingById;

public sealed record GetBookingByIdQuery(Guid Id) : IRequest<BookingDto?>;
