using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBooking;

/// <summary>
/// MediatR command to update booking schedule, services, status (except cancel), and payment option.
/// </summary>
public sealed record UpdateBookingCommand(
    Guid Id,
    Guid CustomerId,
    Guid VehicleId,
    DateTime StartAt,
    IReadOnlyList<Guid>? ServiceCatalogItemIds,
    BookingStatus Status,
    BookingPaymentOption PaymentOption,
    string? Notes
) : IRequest<BookingDto?>;
