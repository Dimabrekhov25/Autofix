using Autofix.Application.ServiceCatalog.Dtos;
using Autofix.Application.ServiceCatalog.Mapping;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Catalog;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;

public sealed class CreateServiceCatalogItemHandler(
    IServiceCatalogRepository repository)
    : IRequestHandler<CreateServiceCatalogItemCommand, ServiceCatalogItemDto>
{
    public async Task<ServiceCatalogItemDto> Handle(CreateServiceCatalogItemCommand request, CancellationToken cancellationToken)
    {
        var item = new ServiceCatalogItem
        {
            Name = request.Name,
            BasePrice = request.BasePrice,
            EstimatedDuration = request.EstimatedDuration,
            IsActive = request.IsActive
        };

        var saved = await repository.AddAsync(item, cancellationToken);
        
        return saved.ToDto();
    }
}
