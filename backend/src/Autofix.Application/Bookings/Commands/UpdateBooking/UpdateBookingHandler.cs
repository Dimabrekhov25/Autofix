using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Bookings.Services;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.BookingFlow;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBooking;

public sealed class UpdateBookingHandler(
    IBookingRepository bookingRepository,
    IBookingTimeSlotRepository bookingTimeSlotRepository,
    ICustomerRepository customerRepository,
    IVehicleRepository vehicleRepository,
    IServiceCatalogRepository serviceCatalogRepository,
    IBookingFlowSettings bookingFlowSettings)
    : IRequestHandler<UpdateBookingCommand, BookingDto?>
{
    public async Task<BookingDto?> Handle(UpdateBookingCommand request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.Id, cancellationToken);
        if (booking is null)
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

        booking.CustomerId = request.CustomerId;
        booking.VehicleId = request.VehicleId;
        booking.BookingTimeSlotId = timeSlot.Id;
        booking.StartAt = timeSlot.StartAt;
        booking.EndAt = endAt;
        booking.Status = request.Status;
        booking.PaymentOption = request.PaymentOption;
        booking.Currency = pricing.Currency;
        booking.Subtotal = pricing.Subtotal;
        booking.EstimatedLaborCost = pricing.EstimatedLaborCost;
        booking.TaxAmount = pricing.TaxAmount;
        booking.TotalEstimate = pricing.TotalEstimate;
        booking.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();
        booking.UpdatedAt = DateTime.UtcNow;
        booking.Services = BookingFlowCalculator.CreateSnapshots(services);

        await bookingRepository.UpdateAsync(booking, cancellationToken);
        return booking.ToDto();
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
