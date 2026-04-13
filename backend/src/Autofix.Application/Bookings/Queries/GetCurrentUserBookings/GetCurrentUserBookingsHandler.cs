using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.CurrentUser;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetCurrentUserBookings;

public sealed class GetCurrentUserBookingsHandler(
    ICurrentUserService currentUserService,
    ICustomerRepository customerRepository,
    IBookingRepository bookingRepository) : IRequestHandler<GetCurrentUserBookingsQuery, IReadOnlyList<BookingDto>>
{
    public async Task<IReadOnlyList<BookingDto>> Handle(
        GetCurrentUserBookingsQuery request,
        CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId;
        if (userId is null)
        {
            throw new UnauthorizedException("The current user could not be resolved.");
        }

        var customer = await customerRepository.GetByUserIdAsync(userId.Value, cancellationToken);
        if (customer is null)
        {
            return [];
        }

        var bookings = await bookingRepository.GetAllAsync(customer.Id, null, cancellationToken);
        return bookings.Select(booking => booking.ToDto()).ToList();
    }
}
