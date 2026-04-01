using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Bookings.Commands.CreateBooking;

public sealed record CreateBookingCommand(
    Guid CustomerId,
    Guid VehicleId,
    DateTime StartAt,
    IReadOnlyList<Guid>? ServiceCatalogItemIds,
    BookingPaymentOption PaymentOption,
    string? Notes
) : IRequest<BookingDto>;
