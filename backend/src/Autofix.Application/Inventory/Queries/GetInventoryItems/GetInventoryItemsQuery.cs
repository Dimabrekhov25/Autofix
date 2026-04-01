using Autofix.Application.Inventory.Dtos;
using MediatR;

namespace Autofix.Application.Inventory.Queries.GetInventoryItems;

public sealed record GetInventoryItemsQuery() : IRequest<IReadOnlyList<InventoryItemDto>>;
