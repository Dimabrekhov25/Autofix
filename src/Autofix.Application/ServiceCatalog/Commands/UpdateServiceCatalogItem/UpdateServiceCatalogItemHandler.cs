using Autofix.Application.Common.Interfaces;
using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.UpdateServiceCatalogItem;

public sealed class UpdateServiceCatalogItemHandler(IServiceCatalogRepository repository)
    : IRequestHandler<UpdateServiceCatalogItemCommand, ServiceCatalogItemDto?>
{
    public async Task<ServiceCatalogItemDto?> Handle(
        UpdateServiceCatalogItemCommand request,
        CancellationToken cancellationToken)
    {
        var updated = await repository.UpdateAsync(
            request.Id,
            request.Name,
            request.BasePrice,
            request.EstimatedDuration,
            request.IsActive,
            cancellationToken);

        return updated?.ToDto();
    }
}
