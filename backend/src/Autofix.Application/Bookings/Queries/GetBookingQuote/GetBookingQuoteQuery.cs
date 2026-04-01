using Autofix.Application.Bookings.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetBookingQuote;

public sealed record GetBookingQuoteQuery(
    Guid VehicleId,
    DateTime StartAt,
    IReadOnlyList<Guid>? ServiceCatalogItemIds,
    BookingPaymentOption PaymentOption = BookingPaymentOption.PayAtShop) : IRequest<BookingQuoteDto>;
