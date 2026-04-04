using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderPartItem;

public sealed class RemoveServiceOrderPartItemHandler(IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<RemoveServiceOrderPartItemCommand, ServiceOrderDto?>
{
    public async Task<ServiceOrderDto?> Handle(
        RemoveServiceOrderPartItemCommand request,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await serviceOrderManagementService.RemovePartItemAsync(
            request.Id,
            request.PartItemId,
            cancellationToken);

        return serviceOrder?.ToDto();
    }
}
