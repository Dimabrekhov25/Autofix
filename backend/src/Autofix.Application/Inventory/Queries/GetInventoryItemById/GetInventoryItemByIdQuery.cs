using Autofix.Application.Inventory.Dtos;
using MediatR;

namespace Autofix.Application.Inventory.Queries.GetInventoryItemById;

/// <summary>
/// Loads a single inventory item by id.
/// </summary>
public sealed record GetInventoryItemByIdQuery(Guid Id) : IRequest<InventoryItemDto?>;
