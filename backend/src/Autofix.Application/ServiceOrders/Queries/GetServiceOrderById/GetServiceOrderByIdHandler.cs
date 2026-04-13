using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetServiceOrderById;

public sealed class GetServiceOrderByIdHandler(IServiceOrderRepository repository)
    : IRequestHandler<GetServiceOrderByIdQuery, ServiceOrderDto?>
{
    public async Task<ServiceOrderDto?> Handle(GetServiceOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var serviceOrder = await repository.GetByIdAsync(request.Id, cancellationToken);
        return serviceOrder?.ToDto();
    }
}
