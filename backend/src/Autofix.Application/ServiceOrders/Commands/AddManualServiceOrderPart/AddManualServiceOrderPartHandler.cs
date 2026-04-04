using Autofix.Application.Common.Interfaces.ServiceOrders;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.AddManualServiceOrderPart;

public sealed class AddManualServiceOrderPartHandler(IServiceOrderManagementService serviceOrderManagementService)
    : IRequestHandler<AddManualServiceOrderPartCommand, ServiceOrderDto>
{
    public async Task<ServiceOrderDto> Handle(
        AddManualServiceOrderPartCommand request,
        CancellationToken cancellationToken)
    {
        var serviceOrder = await serviceOrderManagementService.AddManualPartAsync(
            request.Id,
            request.PartId,
            request.Quantity,
            cancellationToken);

        return serviceOrder.ToDto();
    }
}
