using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Enum;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Bookings.Commands.CreateBooking;

public sealed class CreateBookingHandler(
    IBookingRepository bookingRepository,
    ICustomerRepository customerRepository,
    IVehicleRepository vehicleRepository,
    IServiceCatalogRepository serviceCatalogRepository)
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

        var hasOverlap = await bookingRepository.HasOverlappingBookingAsync(
            request.VehicleId,
            request.StartAt,
            request.EndAt,
            excludeBookingId: null,
            cancellationToken);

        if (hasOverlap)
        {
            throw new BadRequestException("Selected time slot is unavailable");
        }

        var services = await LoadRequestedServicesAsync(request.ServiceCatalogItemIds, cancellationToken);

        var booking = new Booking
        {
            CustomerId = request.CustomerId,
            VehicleId = request.VehicleId,
            StartAt = request.StartAt,
            EndAt = request.EndAt,
            Status = BookingStatus.Created,
            Services = services
        };

        var saved = await bookingRepository.AddAsync(booking, cancellationToken);
        return saved.ToDto();
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
