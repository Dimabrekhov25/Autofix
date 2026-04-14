using Autofix.Application.Common.Interfaces;
using Autofix.Application.Customers.Dtos;
using Autofix.Application.Customers.Mapping;
using MediatR;

namespace Autofix.Application.Customers.Commands.UpdateCustomer;

public sealed class UpdateCustomerHandler(ICustomerRepository repository)
    : IRequestHandler<UpdateCustomerCommand, CustomerDto?>
{
    public async Task<CustomerDto?> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        // Update follows "null when missing" contract for absent customers.
        var customer = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (customer is null)
        {
            return null;
        }

        customer.UserId = request.UserId;
        customer.FullName = request.FullName;
        customer.Phone = request.Phone;
        customer.Email = request.Email;
        customer.Notes = request.Notes;
        customer.UpdatedAt = DateTime.UtcNow;

        // Persistence is handled in repository; handler returns mapped in-memory aggregate.
        await repository.UpdateAsync(customer, cancellationToken);
        return customer.ToDto();
    }
}
