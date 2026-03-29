using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetBookingById;

public sealed class GetBookingByIdHandler(IBookingRepository repository)
    : IRequestHandler<GetBookingByIdQuery, BookingDto?>
{
    public async Task<BookingDto?> Handle(GetBookingByIdQuery request, CancellationToken cancellationToken)
    {
        var booking = await repository.GetByIdAsync(request.Id, cancellationToken);
        return booking?.ToDto();
    }
}
