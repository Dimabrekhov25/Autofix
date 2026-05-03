using Autofix.Application.Inventory.Dtos;
using MediatR;

namespace Autofix.Application.Inventory.Queries.GetInventoryItems;

/// <summary>
/// Lists all inventory items.
/// </summary>
public sealed record GetInventoryItemsQuery() : IRequest<IReadOnlyList<InventoryItemDto>>;
