using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Services;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.BookingFlow;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetAvailableBookingSlots;

public sealed class GetAvailableBookingSlotsHandler(
    IServiceCatalogRepository serviceCatalogRepository,
    IBookingTimeSlotRepository bookingTimeSlotRepository,
    IBookingRepository bookingRepository,
    IBookingFlowSettings bookingFlowSettings)
    : IRequestHandler<GetAvailableBookingSlotsQuery, BookingAvailableSlotsDto>
{
    public async Task<BookingAvailableSlotsDto> Handle(
        GetAvailableBookingSlotsQuery request,
        CancellationToken cancellationToken)
    {
        var services = await LoadRequestedServicesAsync(request.ServiceCatalogItemIds, cancellationToken);
        var totalDuration = BookingFlowCalculator.CalculateTotalDuration(services, bookingFlowSettings);
        var timeSlots = await bookingTimeSlotRepository.GetActiveByDateAsync(request.Date, cancellationToken);
        var slots = new List<BookingAvailableSlotDto>();

        foreach (var timeSlot in timeSlots)
        {
            var slotEnd = timeSlot.StartAt + totalDuration;
            var overlaps = await bookingRepository.CountOverlappingBookingsAsync(
                timeSlot.StartAt,
                slotEnd,
                request.ExcludeBookingId,
                cancellationToken);

            slots.Add(new BookingAvailableSlotDto(
                timeSlot.Id,
                timeSlot.StartAt,
                slotEnd,
                timeSlot.Label,
                overlaps < 1,
                overlaps));
        }

        return new BookingAvailableSlotsDto(
            request.Date.Date,
            totalDuration,
            slots);
    }

    private async Task<IReadOnlyList<ServiceCatalogItem>> LoadRequestedServicesAsync(
        IReadOnlyList<Guid>? serviceCatalogItemIds,
        CancellationToken cancellationToken)
    {
        var normalizedIds = serviceCatalogItemIds?
            .Where(id => id != Guid.Empty)
            .Distinct()
            .ToList() ?? [];

        if (normalizedIds.Count == 0)
        {
            throw new NotFoundException("ServiceCatalogItem", "No services selected");
        }

        var catalogItems = await serviceCatalogRepository.GetByIdsAsync(normalizedIds, cancellationToken);
        if (catalogItems.Count != normalizedIds.Count)
        {
            throw new NotFoundException("ServiceCatalogItem", string.Join(", ", normalizedIds));
        }

        return catalogItems;
    }
}
