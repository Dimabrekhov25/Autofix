using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetServiceOrderByBookingId;

public sealed record GetServiceOrderByBookingIdQuery(Guid BookingId) : IRequest<ServiceOrderDto?>;
