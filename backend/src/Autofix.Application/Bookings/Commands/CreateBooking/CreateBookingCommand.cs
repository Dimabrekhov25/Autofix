using Autofix.Application.Bookings.Results;
using MediatR;

namespace Autofix.Application.Bookings.Commands.CreateBooking;

public sealed record CreateBookingCommand(
    Guid CustomerId,
    Guid VehicleId,
    DateTime StartAt,
    DateTime EndAt,
    IReadOnlyList<Guid>? ServiceCatalogItemIds
) : IRequest<BookingMutationResult>;
