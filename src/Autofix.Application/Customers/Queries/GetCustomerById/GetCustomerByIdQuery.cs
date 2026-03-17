using Autofix.Application.Customers.Dtos;
using MediatR;

namespace Autofix.Application.Customers.Queries.GetCustomerById;

public sealed record GetCustomerByIdQuery(Guid Id) : IRequest<CustomerDto?>;
