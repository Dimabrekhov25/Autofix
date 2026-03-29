using Autofix.Application.Customers.Dtos;
using Autofix.Domain.Entities.People;

namespace Autofix.Application.Customers.Mapping;

public static class CustomerMapper
{
    public static CustomerDto ToDto(this Customer entity)
        => new(entity.Id, entity.UserId, entity.FullName, entity.Phone, entity.Email, entity.Notes);
}
