using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderWorkItem;

/// <summary>
/// Removes a labor line from the order; <c>null</c> when order or work item is missing.
/// </summary>
public sealed record RemoveServiceOrderWorkItemCommand(
    Guid Id,
    Guid WorkItemId) : IRequest<ServiceOrderDto?>;
