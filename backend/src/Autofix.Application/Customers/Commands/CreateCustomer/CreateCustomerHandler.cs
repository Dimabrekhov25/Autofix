using Autofix.Application.Common.Interfaces;
using Autofix.Application.Customers.Dtos;
using Autofix.Application.Customers.Mapping;
using Autofix.Domain.Entities.People;
using MediatR;

namespace Autofix.Application.Customers.Commands.CreateCustomer;

public sealed class CreateCustomerHandler(ICustomerRepository repository)
    : IRequestHandler<CreateCustomerCommand, CustomerDto>
{
    public async Task<CustomerDto> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        // Command maps incoming profile fields into a new customer aggregate.
        var customer = new Customer
        {
            UserId = request.UserId,
            FullName = request.FullName,
            Phone = request.Phone,
            Email = request.Email,
            Notes = request.Notes
        };

        // Repository assigns identity and persistence metadata before returning DTO.
        var saved = await repository.AddAsync(customer, cancellationToken);
        return saved.ToDto();
    }
}
