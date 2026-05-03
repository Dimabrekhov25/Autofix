using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Commands.ApproveBookingEstimate;

/// <summary>
/// Customer approves the workshop estimate for a booking; updates flow through the service order.
/// </summary>
public sealed record ApproveBookingEstimateCommand(Guid Id) : IRequest<BookingDto?>;
