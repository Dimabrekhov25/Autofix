using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItemById;

public sealed class GetServiceCatalogItemByIdHandler(IServiceCatalogRepository repository)
    : IRequestHandler<GetServiceCatalogItemByIdQuery, ServiceCatalogItemDto?>
{
    public async Task<ServiceCatalogItemDto?> Handle(GetServiceCatalogItemByIdQuery request, CancellationToken cancellationToken)
    {
        var item = await repository.GetByIdAsync(request.Id, cancellationToken);
        return item is null ? null : item.ToDto();
    }
}
