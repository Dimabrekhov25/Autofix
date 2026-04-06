using Autofix.Application.Bookings.Dtos;
using MediatR;

namespace Autofix.Application.Bookings.Commands.ApproveBookingEstimate;

public sealed record ApproveBookingEstimateCommand(Guid Id) : IRequest<BookingDto?>;
