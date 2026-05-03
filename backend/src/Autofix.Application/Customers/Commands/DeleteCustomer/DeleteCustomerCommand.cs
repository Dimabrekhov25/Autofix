using MediatR;

namespace Autofix.Application.Customers.Commands.DeleteCustomer;

/// <summary>
/// Deletes a customer by id; result indicates whether a row was removed.
/// </summary>
public sealed record DeleteCustomerCommand(Guid Id) : IRequest<bool>;
