using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Bookings.Commands.DeleteBooking;

public sealed class DeleteBookingHandler(IBookingRepository repository)
    : IRequestHandler<DeleteBookingCommand, bool>
{
    public Task<bool> Handle(DeleteBookingCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
