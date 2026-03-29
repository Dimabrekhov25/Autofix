using Autofix.Domain.Common;
using Autofix.Domain.Enum;

namespace Autofix.Domain.Entities.People;

public sealed class Employee : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public string FullName { get; set; } = string.Empty;
    public EmployeeRole Role { get; set; }
    public bool IsActive { get; set; } = true;
}
