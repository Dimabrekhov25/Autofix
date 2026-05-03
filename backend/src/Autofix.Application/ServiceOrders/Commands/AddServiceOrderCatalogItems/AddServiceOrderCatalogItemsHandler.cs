using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.AddServiceOrderCatalogItems;

/// <summary>
/// Delegates to <see cref="IServiceOrderManagementService.AddCatalogItemsAsync"/> and returns updated DTO.
/// </summary>
public sealed class AddServiceOrderCatalogItemsHandler(IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<AddServiceOrderCatalogItemsCommand, ServiceOrderDto>
{
    /// <inheritdoc />
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
