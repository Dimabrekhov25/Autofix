using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.Bookings;
using MediatR;

namespace Autofix.Application.Bookings.Commands.DeleteBooking;

public sealed class DeleteBookingHandler(IBookingLifecycleService bookingLifecycleService)
    : IRequestHandler<DeleteBookingCommand, bool>
{
    public Task<bool> Handle(DeleteBookingCommand request, CancellationToken cancellationToken)
        => bookingLifecycleService.DeleteAsync(request.Id, cancellationToken);
}
