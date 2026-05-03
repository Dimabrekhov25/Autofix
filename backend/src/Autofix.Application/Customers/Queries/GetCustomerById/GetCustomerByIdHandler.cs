using Autofix.Application.Common.Interfaces;
using Autofix.Application.Customers.Dtos;
using Autofix.Application.Customers.Mapping;
using MediatR;

namespace Autofix.Application.Customers.Queries.GetCustomerById;

/// <summary>
/// Reads customer by id and maps to DTO, or returns <c>null</c>.
/// </summary>
public sealed class GetCustomerByIdHandler(ICustomerRepository repository)
    : IRequestHandler<GetCustomerByIdQuery, CustomerDto?>
{
    /// <inheritdoc />
    public async Task<CustomerDto?> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        // Query follows "null when missing" contract for API-layer 404 mapping.
        var customer = await repository.GetByIdAsync(request.Id, cancellationToken);
        return customer?.ToDto();
    }
}
