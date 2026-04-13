using Autofix.Domain.Enum;

namespace Autofix.Application.Bookings.Dtos;

public sealed record BookingDto(
    Guid Id,
    Guid CustomerId,
    Guid VehicleId,
    BookingVehicleDto? Vehicle,
    Guid? BookingTimeSlotId,
    DateTime StartAt,
    DateTime EndAt,
    BookingStatus Status,
    BookingPaymentOption PaymentOption,
    BookingPricingDto Pricing,
    string? Notes,
    IReadOnlyList<BookingServiceItemDto> Services,
    BookingEstimateDto? Estimate,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
