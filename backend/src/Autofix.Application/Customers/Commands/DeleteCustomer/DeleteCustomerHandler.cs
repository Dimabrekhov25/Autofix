using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Customers.Commands.DeleteCustomer;

/// <summary>
/// Delegates delete to <see cref="ICustomerRepository.DeleteAsync"/>.
/// </summary>
public sealed class DeleteCustomerHandler(ICustomerRepository repository)
    : IRequestHandler<DeleteCustomerCommand, bool>
{
    /// <inheritdoc />
    // Deletion semantics (soft/hard rules) are encapsulated by repository implementation.
    public Task<bool> Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
