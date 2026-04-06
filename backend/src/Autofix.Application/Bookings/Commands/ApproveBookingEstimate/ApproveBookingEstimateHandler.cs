using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.CurrentUser;
using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Domain.Enum;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Commands.ApproveBookingEstimate;

public sealed class ApproveBookingEstimateHandler(
    ICurrentUserService currentUserService,
    ICustomerRepository customerRepository,
    IBookingRepository bookingRepository,
    IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<ApproveBookingEstimateCommand, BookingDto?>
{
    public async Task<BookingDto?> Handle(ApproveBookingEstimateCommand request, CancellationToken cancellationToken)
    {
        var booking = await GetOwnedBookingAsync(request.Id, cancellationToken);
        if (booking is null)
        {
            return null;
        }

        await serviceOrderManagementService.UpdateStatusByBookingIdAsync(
            request.Id,
            ServiceOrderStatus.Approved,
            cancellationToken);

        var updatedBooking = await bookingRepository.GetByIdAsync(request.Id, cancellationToken);
        return updatedBooking?.ToDto();
    }

    private async Task<Domain.Entities.Booking.Booking?> GetOwnedBookingAsync(Guid bookingId, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId;
        if (userId is null)
        {
            throw new UnauthorizedException("The current user could not be resolved.");
        }

        var customer = await customerRepository.GetByUserIdAsync(userId.Value, cancellationToken);
        if (customer is null)
        {
            throw new UnauthorizedException("Customer profile was not found.");
        }

        var booking = await bookingRepository.GetByIdAsync(bookingId, cancellationToken);
        if (booking is null || booking.CustomerId != customer.Id)
        {
            throw new UnauthorizedException("You do not have access to this booking.");
        }

        return booking;
    }
}
