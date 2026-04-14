using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Customers.Commands.DeleteCustomer;

public sealed class DeleteCustomerHandler(ICustomerRepository repository)
    : IRequestHandler<DeleteCustomerCommand, bool>
{
    // Deletion semantics (soft/hard rules) are encapsulated by repository implementation.
    public Task<bool> Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
