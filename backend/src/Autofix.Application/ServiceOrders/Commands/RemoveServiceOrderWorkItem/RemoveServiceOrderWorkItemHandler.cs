using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderWorkItem;

/// <summary>
/// Delegates to <see cref="IServiceOrderManagementService.RemoveWorkItemAsync"/>.
/// </summary>
public sealed class RemoveServiceOrderWorkItemHandler(IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<RemoveServiceOrderWorkItemCommand, ServiceOrderDto?>
{
    /// <inheritdoc />
    public async Task<ServiceOrderDto?> Handle(
        RemoveServiceOrderWorkItemCommand request,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await serviceOrderManagementService.RemoveWorkItemAsync(
            request.Id,
            request.WorkItemId,
            cancellationToken);

        return serviceOrder?.ToDto();
    }
}
