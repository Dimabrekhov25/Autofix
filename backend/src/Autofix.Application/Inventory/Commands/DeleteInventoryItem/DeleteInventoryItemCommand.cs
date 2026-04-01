using MediatR;

namespace Autofix.Application.Inventory.Commands.DeleteInventoryItem;

public sealed record DeleteInventoryItemCommand(Guid Id) : IRequest<bool>;
