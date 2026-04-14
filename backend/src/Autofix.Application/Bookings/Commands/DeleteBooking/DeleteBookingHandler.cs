using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.Bookings;
using MediatR;

namespace Autofix.Application.Bookings.Commands.DeleteBooking;

public sealed class DeleteBookingHandler(IBookingLifecycleService bookingLifecycleService)
    : IRequestHandler<DeleteBookingCommand, bool>
{
    // Deletion behavior is centralized in lifecycle service (state checks and cleanup included).
    public Task<bool> Handle(DeleteBookingCommand request, CancellationToken cancellationToken)
        => bookingLifecycleService.DeleteAsync(request.Id, cancellationToken);
}
