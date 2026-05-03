using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItemById;

/// <summary>
/// Resolves a catalog item by id or returns null when not found.
/// </summary>
public sealed class GetServiceCatalogItemByIdHandler(IServiceCatalogRepository repository)
    : IRequestHandler<GetServiceCatalogItemByIdQuery, ServiceCatalogItemDto?>
{
    /// <inheritdoc />
    public async Task<ServiceCatalogItemDto?> Handle(GetServiceCatalogItemByIdQuery request, CancellationToken cancellationToken)
    {
        // Query follows "null when missing" contract for API-layer 404 mapping.
        var item = await repository.GetByIdAsync(request.Id, cancellationToken);
        return item is null ? null : item.ToDto();
    }
}
