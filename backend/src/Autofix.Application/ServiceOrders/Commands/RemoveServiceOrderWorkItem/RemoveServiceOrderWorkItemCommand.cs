using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderWorkItem;

public sealed record RemoveServiceOrderWorkItemCommand(
    Guid Id,
    Guid WorkItemId) : IRequest<ServiceOrderDto?>;
