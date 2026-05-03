using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetServiceOrderByBookingId;

/// <summary>
/// Resolves the service order created for a booking; <c>null</c> if none exists.
/// </summary>
public sealed record GetServiceOrderByBookingIdQuery(Guid BookingId) : IRequest<ServiceOrderDto?>;
