using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.AddServiceOrderCatalogItems;

public sealed class AddServiceOrderCatalogItemsHandler(IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<AddServiceOrderCatalogItemsCommand, ServiceOrderDto>
{
    public async Task<ServiceOrderDto> Handle(
        AddServiceOrderCatalogItemsCommand request,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await serviceOrderManagementService.AddCatalogItemsAsync(
            request.Id,
            request.ServiceCatalogItemIds,
            cancellationToken);

        return serviceOrder.ToDto();
    }
}
