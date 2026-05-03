using Autofix.Application.Customers.Dtos;
using MediatR;

namespace Autofix.Application.Customers.Commands.CreateCustomer;

/// <summary>
/// Creates a customer profile linked to an application user.
/// </summary>
public sealed record CreateCustomerCommand(
    Guid UserId,
    string FullName,
    string Phone,
    string? Email,
    string? Notes
) : IRequest<CustomerDto>;
