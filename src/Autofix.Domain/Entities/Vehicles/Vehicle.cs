using Autofix.Domain.Common;
using Autofix.Domain.Entities.People;

namespace Autofix.Domain.Entities.Vehicles;

public sealed class Vehicle : BaseEntity
{
    public Guid OwnerCustomerId { get; set; }
    public Customer? OwnerCustomer { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public bool IsDrivable { get; set; }
}
