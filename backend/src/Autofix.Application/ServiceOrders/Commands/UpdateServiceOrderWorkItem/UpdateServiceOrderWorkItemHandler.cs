using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderWorkItem;

public sealed class UpdateServiceOrderWorkItemHandler(IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<UpdateServiceOrderWorkItemCommand, ServiceOrderDto?>
{
    public async Task<ServiceOrderDto?> Handle(
        UpdateServiceOrderWorkItemCommand request,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await serviceOrderManagementService.UpdateWorkItemAsync(
            request.Id,
            request.WorkItemId,
            request.LaborHours,
            request.HourlyRate,
            cancellationToken);

        return serviceOrder?.ToDto();
    }
}
