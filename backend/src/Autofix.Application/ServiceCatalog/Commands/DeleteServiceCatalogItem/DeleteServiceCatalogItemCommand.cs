using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.DeleteServiceCatalogItem;

/// <summary>
/// Deletes a service catalog item by id.
/// </summary>
public sealed record DeleteServiceCatalogItemCommand(Guid Id) : IRequest<bool>;
