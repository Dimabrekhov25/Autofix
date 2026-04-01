using Autofix.Application.Common.Models;
using Autofix.Domain.Entities.Vehicles;

namespace Autofix.Application.Common.Interfaces;

public interface IVehicleRepository
{
    Task<Vehicle> AddAsync(Vehicle vehicle, CancellationToken cancellationToken);
    Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Vehicle?> GetByVinAsync(string vin, CancellationToken cancellationToken);
    Task<IReadOnlyList<Vehicle>> GetPageAsync(
        PageRequest page,
        Guid? ownerCustomerId,
        string? vin,
        CancellationToken cancellationToken);
    Task<int> CountAsync(
        Guid? ownerCustomerId,
        string? vin,
        CancellationToken cancellationToken);
    Task UpdateAsync(Vehicle vehicle, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
