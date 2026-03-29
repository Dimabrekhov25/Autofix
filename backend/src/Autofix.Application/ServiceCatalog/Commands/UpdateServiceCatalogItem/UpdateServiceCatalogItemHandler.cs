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
        var item = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (item is null)
        {
            return null;
        }

        item.Name = request.Name;
        item.BasePrice = request.BasePrice;
        item.EstimatedDuration = request.EstimatedDuration;
        item.IsActive = request.IsActive;
        item.UpdatedAt = DateTime.UtcNow;

        await repository.UpdateAsync(item, cancellationToken);
        return item.ToDto();
    }
}
