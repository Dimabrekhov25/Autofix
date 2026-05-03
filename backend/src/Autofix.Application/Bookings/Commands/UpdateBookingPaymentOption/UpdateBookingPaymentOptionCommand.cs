using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBookingPaymentOption;

/// <summary>
/// Customer updates how they will pay after the booking reached an eligible lifecycle state.
/// </summary>
public sealed record UpdateBookingPaymentOptionCommand(
    Guid Id,
    BookingPaymentOption PaymentOption) : IRequest<BookingDto?>;
