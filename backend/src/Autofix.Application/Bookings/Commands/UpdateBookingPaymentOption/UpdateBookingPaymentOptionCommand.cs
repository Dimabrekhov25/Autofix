using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBookingPaymentOption;

public sealed record UpdateBookingPaymentOptionCommand(
    Guid Id,
    BookingPaymentOption PaymentOption) : IRequest<BookingDto?>;
