using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetAvailableBookingSlots;

public sealed record GetAvailableBookingSlotsQuery(
    DateTime Date,
    IReadOnlyList<Guid>? ServiceCatalogItemIds,
    Guid? ExcludeBookingId = null) : IRequest<BookingAvailableSlotsDto>;
