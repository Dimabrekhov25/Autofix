using Autofix.Application.Common.Interfaces;
using Autofix.Application.Customers.Dtos;
using Autofix.Application.Customers.Mapping;
using MediatR;

namespace Autofix.Application.Customers.Queries.GetCustomers;

/// <summary>
/// Loads customers via <see cref="ICustomerRepository.GetAllAsync"/> and maps each to DTO.
/// </summary>
public sealed class GetCustomersHandler(ICustomerRepository repository)
    : IRequestHandler<GetCustomersQuery, IReadOnlyList<CustomerDto>>
{
    /// <inheritdoc />
    public async Task<IReadOnlyList<CustomerDto>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        // List retrieval intentionally delegates filtering/paging concerns to repository layer.
        var customers = await repository.GetAllAsync(cancellationToken);
        return customers.Select(customer => customer.ToDto()).ToList();
    }
}
