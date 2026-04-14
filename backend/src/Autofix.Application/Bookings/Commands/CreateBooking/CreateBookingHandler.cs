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
        // Booking creation must reference existing customer and vehicle records.
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

        // Bookings can only start at an active predefined slot.
        var timeSlot = await bookingTimeSlotRepository.GetActiveByStartAtAsync(request.StartAt, cancellationToken);
        if (timeSlot is null)
        {
            throw new BadRequestException("Selected time slot does not exist");
        }

        var services = await LoadRequestedServicesAsync(request.ServiceCatalogItemIds, cancellationToken);
        var endAt = BookingFlowCalculator.CalculateEndAt(timeSlot.StartAt, services, bookingFlowSettings);
        var pricing = BookingFlowCalculator.CalculatePricing(services, bookingFlowSettings);

        // First overlap check enforces one booking per vehicle in the same interval.
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

        // Second overlap check enforces workshop-wide capacity for the interval.
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
            Status = BookingStatus.Pending,
            PaymentOption = request.PaymentOption,
            Currency = pricing.Currency,
            Subtotal = pricing.Subtotal,
            EstimatedLaborCost = pricing.EstimatedLaborCost,
            TaxAmount = pricing.TaxAmount,
            TotalEstimate = pricing.TotalEstimate,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            Services = BookingFlowCalculator.CreateSnapshots(services)
        };

        // Lifecycle service persists booking and synchronizes related booking flow side effects.
        var saved = await bookingLifecycleService.CreateAsync(booking, services, cancellationToken);
        return saved.ToDto();
    }

    private async Task<IReadOnlyList<Autofix.Domain.Entities.Catalog.ServiceCatalogItem>> LoadRequestedServicesAsync(
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
