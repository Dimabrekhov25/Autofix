using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetAvailableBookingSlots;

/// <summary>
/// For a calendar date and selected services, returns slot candidates with availability based on duration and overlaps.
/// </summary>
public sealed record GetAvailableBookingSlotsQuery(
    DateTime Date,
    IReadOnlyList<Guid>? ServiceCatalogItemIds,
    Guid? ExcludeBookingId = null) : IRequest<BookingAvailableSlotsDto>;
