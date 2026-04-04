using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.AddManualServiceOrderPart;

public sealed record AddManualServiceOrderPartCommand(
    Guid Id,
    Guid PartId,
    int Quantity) : IRequest<ServiceOrderDto>;
