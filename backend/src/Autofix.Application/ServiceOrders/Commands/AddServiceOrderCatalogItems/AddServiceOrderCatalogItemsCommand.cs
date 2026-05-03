using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.AddServiceOrderCatalogItems;

/// <summary>
/// Adds catalog services to a service order as labor lines (by catalog item ids).
/// </summary>
public sealed record AddServiceOrderCatalogItemsCommand(
    Guid Id,
    IReadOnlyList<Guid> ServiceCatalogItemIds) : IRequest<ServiceOrderDto>;
