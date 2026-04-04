using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetServiceOrderById;

public sealed record GetServiceOrderByIdQuery(Guid Id) : IRequest<ServiceOrderDto?>;
