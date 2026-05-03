using Autofix.Application.Bookings.Dtos;
using Autofix.Application.Common.Interfaces.BookingFlow;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;

namespace Autofix.Application.Bookings.Services;

/// <summary>
/// Pure helpers for booking duration, end time, pricing, and persisting catalog snapshots when creating a booking.
/// </summary>
internal static class BookingFlowCalculator
{
    /// <summary>
    /// Sums catalog service durations and adds the configured buffer (e.g. handoff time).
    /// </summary>
    public static TimeSpan CalculateTotalDuration(
        IReadOnlyCollection<ServiceCatalogItem> services,
        IBookingFlowSettings settings)
    {
        // Booking windows include service duration plus configurable buffer for handoff/cleanup.
        var serviceDuration = services.Aggregate(TimeSpan.Zero, (current, item) => current + item.EstimatedDuration);
        return serviceDuration + TimeSpan.FromMinutes(settings.BufferMinutes);
    }

    /// <summary>
    /// Computes the booking end instant from <paramref name="startAt"/> and total duration (including buffer).
    /// </summary>
    public static DateTime CalculateEndAt(
        DateTime startAt,
        IReadOnlyCollection<ServiceCatalogItem> services,
        IBookingFlowSettings settings)
        => startAt + CalculateTotalDuration(services, settings);

    /// <summary>
    /// Builds subtotal, labor, tax (from settings), and total estimate for the selected services.
    /// </summary>
    public static BookingPricingDto CalculatePricing(
        IReadOnlyCollection<ServiceCatalogItem> services,
        IBookingFlowSettings settings)
    {
        // Tax is applied on combined parts+labor estimate using shared booking flow settings.
        var subtotal = services.Sum(service => service.BasePrice);
        var estimatedLaborCost = services.Sum(service => service.EstimatedLaborCost);
        var taxAmount = decimal.Round((subtotal + estimatedLaborCost) * settings.DefaultTaxRate, 2, MidpointRounding.AwayFromZero);
        var totalEstimate = subtotal + estimatedLaborCost + taxAmount;

        return new BookingPricingDto(subtotal, estimatedLaborCost, taxAmount, totalEstimate, settings.Currency);
    }

    /// <summary>
    /// Creates <see cref="BookingServiceItem"/> rows that copy catalog fields at booking time.
    /// </summary>
    public static List<BookingServiceItem> CreateSnapshots(IReadOnlyCollection<ServiceCatalogItem> services)
        // Snapshot preserves catalog values at booking time, even if catalog entries change later.
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
