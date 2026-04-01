using Autofix.Domain.Common;
using Autofix.Domain.Entities.People;

namespace Autofix.Domain.Entities.Vehicles;

public sealed class Vehicle : BaseEntity
{
    public Guid OwnerCustomerId { get; set; }
    public Customer? OwnerCustomer { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public string? Vin { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string? Trim { get; set; }
    public string? Engine { get; set; }
    public bool IsDrivable { get; set; }
}
