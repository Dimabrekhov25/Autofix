using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItems;

public sealed class GetServiceCatalogItemsHandler(IServiceCatalogRepository repository)
    : IRequestHandler<GetServiceCatalogItemsQuery, IReadOnlyList<ServiceCatalogItemDto>>
{
    public async Task<IReadOnlyList<ServiceCatalogItemDto>> Handle(GetServiceCatalogItemsQuery request, CancellationToken cancellationToken)
    {
        var items = await repository.GetAllAsync(cancellationToken);
        return items.Select(item => item.ToDto()).ToList();
    }
}
