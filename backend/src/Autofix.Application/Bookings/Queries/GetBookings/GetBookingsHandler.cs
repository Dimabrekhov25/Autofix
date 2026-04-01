using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetBookings;

public sealed class GetBookingsHandler(IBookingRepository repository)
    : IRequestHandler<GetBookingsQuery, IReadOnlyList<BookingDto>>
{
    public async Task<IReadOnlyList<BookingDto>> Handle(GetBookingsQuery request, CancellationToken cancellationToken)
    {
        var bookings = await repository.GetAllAsync(request.CustomerId, request.VehicleId, cancellationToken);
        return bookings.Select(booking => booking.ToDto()).ToList();
    }
}
