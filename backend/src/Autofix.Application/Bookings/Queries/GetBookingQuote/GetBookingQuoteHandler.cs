using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Services;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.BookingFlow;
using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Enum;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Queries.GetBookingQuote;

public sealed class GetBookingQuoteHandler(
    IVehicleRepository vehicleRepository,
    IServiceCatalogRepository serviceCatalogRepository,
    IBookingTimeSlotRepository bookingTimeSlotRepository,
    IBookingRepository bookingRepository,
    IBookingFlowSettings bookingFlowSettings)
    : IRequestHandler<GetBookingQuoteQuery, BookingQuoteDto>
{
    public async Task<BookingQuoteDto> Handle(GetBookingQuoteQuery request, CancellationToken cancellationToken)
    {
        // Quote generation requires a real vehicle because returned DTO includes vehicle snapshot details.
        var vehicle = await vehicleRepository.GetByIdAsync(request.VehicleId, cancellationToken);
        if (vehicle is null)
        {
            throw new NotFoundException("Vehicle", request.VehicleId);
        }

        // Quotes are only computed for active predefined slot starts.
        var timeSlot = await bookingTimeSlotRepository.GetActiveByStartAtAsync(request.StartAt, cancellationToken);
        if (timeSlot is null)
        {
            throw new BadRequestException("Selected time slot does not exist");
        }

        var services = await LoadRequestedServicesAsync(request.ServiceCatalogItemIds, cancellationToken);
        var endAt = BookingFlowCalculator.CalculateEndAt(timeSlot.StartAt, services, bookingFlowSettings);
        // Availability gate: quote is rejected when the computed interval is already occupied.
        var overlapCount = await bookingRepository.CountOverlappingBookingsAsync(
            timeSlot.StartAt,
            endAt,
            excludeBookingId: null,
            cancellationToken);

        if (overlapCount > 0)
        {
            throw new BadRequestException("Selected time slot is unavailable");
        }

        var pricing = BookingFlowCalculator.CalculatePricing(services, bookingFlowSettings);

        // Response intentionally returns deterministic service ordering for stable UI rendering.
        return new BookingQuoteDto(
            new BookingQuoteVehicleDto(
                vehicle.Id,
                vehicle.LicensePlate,
                vehicle.Vin ?? string.Empty,
                vehicle.Make,
                vehicle.Model,
                vehicle.Year,
                vehicle.Trim,
                vehicle.Engine),
            new BookingQuoteScheduleDto(
                timeSlot.StartAt,
                endAt,
                endAt - timeSlot.StartAt),
            pricing,
            services
                .OrderBy(service => service.Name)
                .Select(service => new BookingQuoteServiceDto(
                    service.Id,
                    service.Name,
                    service.Description,
                    service.Category,
                    service.BasePrice,
                    service.EstimatedLaborCost,
                    service.EstimatedDuration,
                    service.RequiredParts
                        .Where(part => !part.IsDeleted && part.Part is not null)
                        .Select(part => new ServiceCatalogRequiredPartDto(
                            part.PartId,
                            part.Part!.Name,
                            part.Part.UnitPrice,
                            part.Quantity))
                        .ToList()))
                .ToList(),
            [BookingPaymentOption.PayNow, BookingPaymentOption.PayAtShop]);
    }

    private async Task<IReadOnlyList<ServiceCatalogItem>> LoadRequestedServicesAsync(
        IReadOnlyList<Guid>? serviceCatalogItemIds,
        CancellationToken cancellationToken)
    {
        // Normalize incoming IDs so downstream lookups operate on a clean, unique set.
        var normalizedIds = serviceCatalogItemIds?
            .Where(id => id != Guid.Empty)
            .Distinct()
            .ToList() ?? [];

        if (normalizedIds.Count == 0)
        {
            throw new NotFoundException("ServiceCatalogItem", "No services selected");
        }

        // Count mismatch means at least one requested service ID does not exist.
        var catalogItems = await serviceCatalogRepository.GetByIdsAsync(normalizedIds, cancellationToken);
        if (catalogItems.Count != normalizedIds.Count)
        {
            throw new NotFoundException("ServiceCatalogItem", string.Join(", ", normalizedIds));
        }

        return catalogItems;
    }
}
