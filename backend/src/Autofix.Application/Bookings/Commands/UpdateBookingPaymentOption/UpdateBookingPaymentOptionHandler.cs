using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.CurrentUser;
using Autofix.Domain.Enum;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBookingPaymentOption;

public sealed class UpdateBookingPaymentOptionHandler(
    ICurrentUserService currentUserService,
    ICustomerRepository customerRepository,
    IBookingRepository bookingRepository)
    : IRequestHandler<UpdateBookingPaymentOptionCommand, BookingDto?>
{
    public async Task<BookingDto?> Handle(
        UpdateBookingPaymentOptionCommand request,
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
            throw new UnauthorizedException("Customer profile was not found.");
        }

        var booking = await bookingRepository.GetByIdAsync(request.Id, cancellationToken);
        if (booking is null)
        {
            return null;
        }

        if (booking.CustomerId != customer.Id)
        {
            throw new UnauthorizedException("You do not have access to this booking.");
        }

        if (booking.Status is not (BookingStatus.Approved or BookingStatus.InProgress or BookingStatus.Completed))
        {
            throw new BadRequestException("Payment can only be selected after the estimate has been approved.");
        }

        var updatedBooking = await bookingRepository.UpdatePaymentOptionAsync(
            request.Id,
            request.PaymentOption,
            cancellationToken);

        return updatedBooking?.ToDto();
    }
}
