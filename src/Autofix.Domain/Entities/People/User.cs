using Autofix.Domain.Common;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.People;

public sealed class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public Employee? Employee { get; set; }
    public Customer? Customer { get; set; }
    public bool IsActive { get; set; } = true;
}
