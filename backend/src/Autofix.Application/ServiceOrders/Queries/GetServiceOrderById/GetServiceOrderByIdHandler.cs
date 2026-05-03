using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceOrders.Dtos;
using Autofix.Application.ServiceOrders.Mapping;
using MediatR;

namespace Autofix.Application.ServiceOrders.Queries.GetServiceOrderById;

/// <summary>
/// Reads from <see cref="IServiceOrderRepository"/> and maps to <see cref="ServiceOrderDto"/>.
/// </summary>
public sealed class GetServiceOrderByIdHandler(IServiceOrderRepository repository)
    : IRequestHandler<GetServiceOrderByIdQuery, ServiceOrderDto?>
{
    /// <inheritdoc />
    public async Task<ServiceOrderDto?> Handle(GetServiceOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var serviceOrder = await repository.GetByIdAsync(request.Id, cancellationToken);
        return serviceOrder?.ToDto();
    }
}
