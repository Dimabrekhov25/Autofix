using Autofix.Application.Inventory.Dtos;
using MediatR;

namespace Autofix.Application.Inventory.Queries.GetInventoryItemById;

public sealed record GetInventoryItemByIdQuery(Guid Id) : IRequest<InventoryItemDto?>;
