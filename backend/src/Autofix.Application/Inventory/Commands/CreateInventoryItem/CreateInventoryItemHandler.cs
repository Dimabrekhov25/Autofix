using Autofix.Application.Common.Interfaces;
using Autofix.Application.Inventory.Dtos;
using Autofix.Application.Inventory.Mapping;
using Autofix.Domain.Entities.Inventory;
using Autofix.Domain.Exceptions;
using MediatR;

namespace Autofix.Application.Inventory.Commands.CreateInventoryItem;

public sealed class CreateInventoryItemHandler(
    IInventoryRepository inventoryRepository,
    IPartRepository partRepository)
    : IRequestHandler<CreateInventoryItemCommand, InventoryItemDto>
{
    public async Task<InventoryItemDto> Handle(CreateInventoryItemCommand request, CancellationToken cancellationToken)
    {
        var part = await partRepository.GetByIdAsync(request.PartId, cancellationToken);
        if (part is null)
        {
            throw new NotFoundException("Part", request.PartId);
        }

        var item = new InventoryItem
        {
            PartId = request.PartId,
            QuantityOnHand = request.QuantityOnHand,
            ReservedQuantity = request.ReservedQuantity,
            MinLevel = request.MinLevel
        };

        var saved = await inventoryRepository.AddAsync(item, cancellationToken);
        return saved.ToDto();
    }
}
