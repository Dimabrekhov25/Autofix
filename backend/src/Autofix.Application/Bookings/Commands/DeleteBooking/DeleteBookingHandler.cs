using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.Bookings;
using MediatR;

namespace Autofix.Application.Bookings.Commands.DeleteBooking;

/// <summary>
/// Delegates delete semantics to <see cref="IBookingLifecycleService"/> (rules and side effects live there).
/// </summary>
public sealed class DeleteBookingHandler(IBookingLifecycleService bookingLifecycleService)
    : IRequestHandler<DeleteBookingCommand, bool>
{
    /// <inheritdoc />
    // Deletion behavior is centralized in lifecycle service (state checks and cleanup included).
    public Task<bool> Handle(DeleteBookingCommand request, CancellationToken cancellationToken)
        => bookingLifecycleService.DeleteAsync(request.Id, cancellationToken);
}
