using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBookingServiceOrderStatus;

public sealed class UpdateBookingServiceOrderStatusHandler(
    IBookingRepository bookingRepository,
    IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<UpdateBookingServiceOrderStatusCommand, BookingDto?>
{
    public async Task<BookingDto?> Handle(
        UpdateBookingServiceOrderStatusCommand request,
        CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.Id, cancellationToken);
        if (booking is null)
        {
            return null;
        }

        var serviceOrder = await serviceOrderManagementService.UpdateStatusByBookingIdAsync(
            request.Id,
            request.Status,
            cancellationToken);

        if (serviceOrder is null)
        {
            throw new NotFoundException("ServiceOrder", request.Id);
        }

        var updatedBooking = await bookingRepository.GetByIdAsync(request.Id, cancellationToken);
        return updatedBooking?.ToDto();
    }
}
