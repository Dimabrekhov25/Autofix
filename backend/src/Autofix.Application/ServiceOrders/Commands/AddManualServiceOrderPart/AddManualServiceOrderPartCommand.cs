using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.AddManualServiceOrderPart;

/// <summary>
/// Adds a part line to the order from inventory master data (not from catalog bundle).
/// </summary>
public sealed record AddManualServiceOrderPartCommand(
    Guid Id,
    Guid PartId,
    int Quantity) : IRequest<ServiceOrderDto>;
