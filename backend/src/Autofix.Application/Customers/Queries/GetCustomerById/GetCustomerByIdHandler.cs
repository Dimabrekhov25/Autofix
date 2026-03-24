using Autofix.Application.Common.Interfaces;
using Autofix.Application.Customers.Dtos;
using Autofix.Application.Customers.Mapping;
using MediatR;

namespace Autofix.Application.Customers.Queries.GetCustomerById;

public sealed class GetCustomerByIdHandler(ICustomerRepository repository)
    : IRequestHandler<GetCustomerByIdQuery, CustomerDto?>
{
    public async Task<CustomerDto?> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        var customer = await repository.GetByIdAsync(request.Id, cancellationToken);
        return customer?.ToDto();
    }
}
