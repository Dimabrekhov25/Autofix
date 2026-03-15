using Autofix.Application.Common.Models;
using Autofix.Domain.Entities.Vehicles;

namespace Autofix.Application.Common.Interfaces;

public interface IVehicleRepository
{
    Task<Vehicle> AddAsync(Vehicle vehicle, CancellationToken cancellationToken);
    Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<Vehicle>> GetPageAsync(PageRequest page, CancellationToken cancellationToken);
    Task<int> CountAsync(CancellationToken cancellationToken);
    Task<Vehicle?> UpdateAsync(
        Guid id,
        Guid ownerCustomerId,
        string licensePlate,
        string make,
        string model,
        int year,
        bool isDrivable,
        CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
