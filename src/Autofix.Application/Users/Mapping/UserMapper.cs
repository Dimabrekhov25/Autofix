using Autofix.Application.Users.Dtos;
using Autofix.Domain.Entities.People;

namespace Autofix.Application.Users.Mapping;

public static class UserMapper
{
    public static UserDto ToDto(this User entity)
        => new(entity.Id, entity.Username, entity.PasswordHash, entity.Role, entity.IsActive);
}
