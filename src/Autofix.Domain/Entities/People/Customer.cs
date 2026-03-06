using Autofix.Domain.Common;

namespace Autofix.Domain.Entities.People;

public sealed class Customer : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Notes { get; set; }
}
