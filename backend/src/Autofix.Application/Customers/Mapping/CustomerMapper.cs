using Autofix.Application.Customers.Dtos;
using Autofix.Domain.Entities.People;

namespace Autofix.Application.Customers.Mapping;

/// <summary>
/// Maps domain <see cref="Customer"/> to <see cref="CustomerDto"/>.
/// </summary>
public static class CustomerMapper
{
    /// <summary>Projects entity fields into a DTO.</summary>
    public static CustomerDto ToDto(this Customer entity)
        => new(entity.Id, entity.UserId, entity.FullName, entity.Phone, entity.Email, entity.Notes);
}
