using Autofix.Application.Bookings.Mapping;
using Autofix.Application.Bookings.Results;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;
using MediatR;

namespace Autofix.Application.Bookings.Commands.UpdateBooking;

public sealed class UpdateBookingHandler(
    IBookingRepository bookingRepository,
    ICustomerRepository customerRepository,
    IVehicleRepository vehicleRepository,
    IServiceCatalogRepository serviceCatalogRepository)
    : IRequestHandler<UpdateBookingCommand, BookingMutationResult>
{
    public async Task<BookingMutationResult> Handle(UpdateBookingCommand request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.Id, cancellationToken);
        if (booking is null)
        {
            return new BookingMutationResult(null, BookingMutationError.BookingNotFound);
        }

        var customer = await customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer is null)
        {
            return new BookingMutationResult(null, BookingMutationError.CustomerNotFound);
        }

        var vehicle = await vehicleRepository.GetByIdAsync(request.VehicleId, cancellationToken);
        if (vehicle is null)
        {
            return new BookingMutationResult(null, BookingMutationError.VehicleNotFound);
        }

        if (vehicle.OwnerCustomerId != request.CustomerId)
        {
            return new BookingMutationResult(null, BookingMutationError.VehicleDoesNotBelongToCustomer);
        }

        var hasOverlap = await bookingRepository.HasOverlappingBookingAsync(
            request.VehicleId,
            request.StartAt,
            request.EndAt,
            request.Id,
            cancellationToken);

        if (hasOverlap)
        {
            return new BookingMutationResult(null, BookingMutationError.TimeSlotUnavailable);
        }

        var services = await LoadRequestedServicesAsync(request.ServiceCatalogItemIds, cancellationToken);
        if (services is null)
        {
            return new BookingMutationResult(null, BookingMutationError.ServiceCatalogItemsNotFound);
        }

        booking.CustomerId = request.CustomerId;
        booking.VehicleId = request.VehicleId;
        booking.StartAt = request.StartAt;
        booking.EndAt = request.EndAt;
        booking.Status = request.Status;
        booking.UpdatedAt = DateTime.UtcNow;
        booking.Services = services;

        await bookingRepository.UpdateAsync(booking, cancellationToken);
        return new BookingMutationResult(booking.ToDto());
    }

    private async Task<List<BookingServiceItem>?> LoadRequestedServicesAsync(
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
            return null;
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
