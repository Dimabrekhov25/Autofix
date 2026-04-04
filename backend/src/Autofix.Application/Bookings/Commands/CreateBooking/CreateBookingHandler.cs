using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Bookings.Services;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.Bookings;
using Autofix.Application.Common.Interfaces.BookingFlow;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Enum;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Commands.CreateBooking;

public sealed class CreateBookingHandler(
    IBookingRepository bookingRepository,
    IBookingLifecycleService bookingLifecycleService,
    IBookingTimeSlotRepository bookingTimeSlotRepository,
    ICustomerRepository customerRepository,
    IVehicleRepository vehicleRepository,
    IServiceCatalogRepository serviceCatalogRepository,
    IBookingFlowSettings bookingFlowSettings)
    : IRequestHandler<CreateBookingCommand, BookingDto>
{
    public async Task<BookingDto> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
    {
        var customer = await customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer is null)
        {
            throw new NotFoundException("Customer", request.CustomerId);
        }

        var vehicle = await vehicleRepository.GetByIdAsync(request.VehicleId, cancellationToken);
        if (vehicle is null)
        {
            throw new NotFoundException("Vehicle", request.VehicleId);
        }

        if (vehicle.OwnerCustomerId != request.CustomerId)
        {
            throw new BadRequestException("Vehicle does not belong to customer");
        }

        var timeSlot = await bookingTimeSlotRepository.GetActiveByStartAtAsync(request.StartAt, cancellationToken);
        if (timeSlot is null)
        {
            throw new BadRequestException("Selected time slot does not exist");
        }

        var services = await LoadRequestedServicesAsync(request.ServiceCatalogItemIds, cancellationToken);
        var endAt = BookingFlowCalculator.CalculateEndAt(timeSlot.StartAt, services, bookingFlowSettings);
        var pricing = BookingFlowCalculator.CalculatePricing(services, bookingFlowSettings);

        var hasVehicleOverlap = await bookingRepository.HasOverlappingBookingAsync(
            request.VehicleId,
            timeSlot.StartAt,
            endAt,
            excludeBookingId: null,
            cancellationToken);

        if (hasVehicleOverlap)
        {
            throw new BadRequestException("Selected time slot is unavailable");
        }

        var overlapCount = await bookingRepository.CountOverlappingBookingsAsync(
            timeSlot.StartAt,
            endAt,
            excludeBookingId: null,
            cancellationToken);

        if (overlapCount > 0)
        {
            throw new BadRequestException("Selected time slot is unavailable");
        }

        var booking = new Booking
        {
            CustomerId = request.CustomerId,
            VehicleId = request.VehicleId,
            BookingTimeSlotId = timeSlot.Id,
            StartAt = timeSlot.StartAt,
            EndAt = endAt,
            Status = BookingStatus.Created,
            PaymentOption = request.PaymentOption,
            Currency = pricing.Currency,
            Subtotal = pricing.Subtotal,
            EstimatedLaborCost = pricing.EstimatedLaborCost,
            TaxAmount = pricing.TaxAmount,
            TotalEstimate = pricing.TotalEstimate,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            Services = BookingFlowCalculator.CreateSnapshots(services)
        };

        var saved = await bookingLifecycleService.CreateAsync(booking, services, cancellationToken);
        return saved.ToDto();
    }

    private async Task<IReadOnlyList<Autofix.Domain.Entities.Catalog.ServiceCatalogItem>> LoadRequestedServicesAsync(
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
