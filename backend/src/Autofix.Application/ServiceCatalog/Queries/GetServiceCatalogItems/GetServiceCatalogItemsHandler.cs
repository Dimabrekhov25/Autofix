using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItems;

public sealed class GetServiceCatalogItemsHandler(
    IServiceCatalogRepository repository)
    : IRequestHandler<GetServiceCatalogItemsQuery, IReadOnlyList<ServiceCatalogItemDto>>
{
    public async Task<IReadOnlyList<ServiceCatalogItemDto>> Handle(GetServiceCatalogItemsQuery request, CancellationToken cancellationToken)
    {
        var items = await repository.GetAllAsync(request.IsActive, null, cancellationToken);

        if (request.Category.HasValue)
        {
            items = items
                .Where(item => item.Category == request.Category.Value)
                .ToList();
        }

        return items.Select(item => item.ToDto()).ToList();
    }
}
