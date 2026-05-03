using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.ServiceCatalog.Commands.DeleteServiceCatalogItem;

/// <summary>
/// Removes a service catalog item via the repository.
/// </summary>
public sealed class DeleteServiceCatalogItemHandler(IServiceCatalogRepository repository)
    : IRequestHandler<DeleteServiceCatalogItemCommand, bool>
{
    // Deletion semantics are owned by repository implementation (soft/hard policy).
    /// <inheritdoc />
    public Task<bool> Handle(DeleteServiceCatalogItemCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
