using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.DeleteServiceCatalogItem;

public sealed record DeleteServiceCatalogItemCommand(Guid Id) : IRequest<bool>;
