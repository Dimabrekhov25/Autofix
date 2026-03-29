using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBooking;

public sealed class UpdateBookingHandler(
    IBookingRepository bookingRepository,
    ICustomerRepository customerRepository,
    IVehicleRepository vehicleRepository,
    IServiceCatalogRepository serviceCatalogRepository)
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

        var hasOverlap = await bookingRepository.HasOverlappingBookingAsync(
            request.VehicleId,
            request.StartAt,
            request.EndAt,
            request.Id,
            cancellationToken);

        if (hasOverlap)
        {
            throw new BadRequestException("Selected time slot is unavailable");
        }

        var services = await LoadRequestedServicesAsync(request.ServiceCatalogItemIds, cancellationToken);

        booking.CustomerId = request.CustomerId;
        booking.VehicleId = request.VehicleId;
        booking.StartAt = request.StartAt;
        booking.EndAt = request.EndAt;
        booking.Status = request.Status;
        booking.UpdatedAt = DateTime.UtcNow;
        booking.Services = services;

        await bookingRepository.UpdateAsync(booking, cancellationToken);
        return booking.ToDto();
    }

    private async Task<List<BookingServiceItem>> LoadRequestedServicesAsync(
        IReadOnlyList<Guid>? serviceCatalogItemIds,
        CancellationToken cancellationToken)
    {
        var normalizedIds = serviceCatalogItemIds?
            .Where(id => id != Guid.Empty)
            .Distinct()
            .ToList() ?? [];

        if (normalizedIds.Count == 0)
        {
            return [];
        }

        var catalogItems = await serviceCatalogRepository.GetByIdsAsync(normalizedIds, cancellationToken);
        if (catalogItems.Count != normalizedIds.Count)
        {
            throw new NotFoundException("ServiceCatalogItem", string.Join(", ", normalizedIds));
        }

        return catalogItems
            .Select(CreateServiceSnapshot)
            .ToList();
    }

    private static BookingServiceItem CreateServiceSnapshot(ServiceCatalogItem item)
        => new()
        {
            ServiceCatalogItemId = item.Id,
            Name = item.Name,
            BasePrice = item.BasePrice,
            EstimatedDuration = item.EstimatedDuration
        };
}
