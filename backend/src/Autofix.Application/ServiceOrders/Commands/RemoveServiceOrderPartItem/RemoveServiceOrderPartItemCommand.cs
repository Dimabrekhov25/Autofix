using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderPartItem;

public sealed record RemoveServiceOrderPartItemCommand(
    Guid Id,
    Guid PartItemId) : IRequest<ServiceOrderDto?>;
