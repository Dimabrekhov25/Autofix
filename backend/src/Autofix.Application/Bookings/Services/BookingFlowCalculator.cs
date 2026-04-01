using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Common.Interfaces.BookingFlow;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.Bookings.Services;

internal static class BookingFlowCalculator
{
    public static TimeSpan CalculateTotalDuration(
        IReadOnlyCollection<ServiceCatalogItem> services,
        IBookingFlowSettings settings)
    {
        var serviceDuration = services.Aggregate(TimeSpan.Zero, (current, item) => current + item.EstimatedDuration);
        return serviceDuration + TimeSpan.FromMinutes(settings.BufferMinutes);
    }

    public static DateTime CalculateEndAt(
        DateTime startAt,
        IReadOnlyCollection<ServiceCatalogItem> services,
        IBookingFlowSettings settings)
        => startAt + CalculateTotalDuration(services, settings);

    public static BookingPricingDto CalculatePricing(
        IReadOnlyCollection<ServiceCatalogItem> services,
        IBookingFlowSettings settings)
    {
        var subtotal = services.Sum(service => service.BasePrice);
        var estimatedLaborCost = services.Sum(service => service.EstimatedLaborCost);
        var taxAmount = decimal.Round((subtotal + estimatedLaborCost) * settings.DefaultTaxRate, 2, MidpointRounding.AwayFromZero);
        var totalEstimate = subtotal + estimatedLaborCost + taxAmount;

        return new BookingPricingDto(subtotal, estimatedLaborCost, taxAmount, totalEstimate, settings.Currency);
    }

    public static List<BookingServiceItem> CreateSnapshots(IReadOnlyCollection<ServiceCatalogItem> services)
        => services
            .Select(service => new BookingServiceItem
            {
                ServiceCatalogItemId = service.Id,
                Name = service.Name,
                Description = service.Description,
                Category = service.Category,
                BasePrice = service.BasePrice,
                EstimatedLaborCost = service.EstimatedLaborCost,
                EstimatedDuration = service.EstimatedDuration
            })
            .ToList();
}
