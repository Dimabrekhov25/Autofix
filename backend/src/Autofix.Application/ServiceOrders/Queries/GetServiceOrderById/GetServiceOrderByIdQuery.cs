using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetServiceOrderById;

/// <summary>
/// Loads a service order by primary key; <c>null</c> result means not found.
/// </summary>
public sealed record GetServiceOrderByIdQuery(Guid Id) : IRequest<ServiceOrderDto?>;
