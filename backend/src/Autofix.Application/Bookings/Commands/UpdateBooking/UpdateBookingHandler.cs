using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Bookings.Services;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.Bookings;
using Autofix.Application.Common.Interfaces.BookingFlow;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBooking;

public sealed class UpdateBookingHandler(
    IBookingRepository bookingRepository,
    IBookingLifecycleService bookingLifecycleService,
    IBookingTimeSlotRepository bookingTimeSlotRepository,
    ICustomerRepository customerRepository,
    IVehicleRepository vehicleRepository,
    IServiceCatalogRepository serviceCatalogRepository,
    IBookingFlowSettings bookingFlowSettings)
    : IRequestHandler<UpdateBookingCommand, BookingDto?>
{
    public async Task<BookingDto?> Handle(UpdateBookingCommand request, CancellationToken cancellationToken)
    {
        var existingBooking = await bookingRepository.GetByIdAsync(request.Id, cancellationToken);
        if (existingBooking is null)
        {
            return null;
        }

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
            request.Id,
            cancellationToken);

        if (hasVehicleOverlap)
        {
            throw new BadRequestException("Selected time slot is unavailable");
        }

        var overlapCount = await bookingRepository.CountOverlappingBookingsAsync(
            timeSlot.StartAt,
            endAt,
            request.Id,
            cancellationToken);

        if (overlapCount > 0)
        {
            throw new BadRequestException("Selected time slot is unavailable");
        }

        if (request.Status == Autofix.Domain.Enum.BookingStatus.Cancelled)
        {
            throw new BadRequestException("Use the cancel endpoint to cancel a booking.");
        }

        var booking = new Booking
        {
            Id = request.Id,
            CustomerId = request.CustomerId,
            VehicleId = request.VehicleId,
            BookingTimeSlotId = timeSlot.Id,
            StartAt = timeSlot.StartAt,
            EndAt = endAt,
            Status = request.Status,
            PaymentOption = request.PaymentOption,
            Currency = pricing.Currency,
            Subtotal = pricing.Subtotal,
            EstimatedLaborCost = pricing.EstimatedLaborCost,
            TaxAmount = pricing.TaxAmount,
            TotalEstimate = pricing.TotalEstimate,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            UpdatedAt = DateTime.UtcNow,
            Services = BookingFlowCalculator.CreateSnapshots(services)
        };

        var updated = await bookingLifecycleService.UpdateAsync(booking, services, cancellationToken);
        return updated?.ToDto();
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
