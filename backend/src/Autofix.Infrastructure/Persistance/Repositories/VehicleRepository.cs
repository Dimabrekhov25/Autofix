using Autofix.Application.Common.Models;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Vehicles;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class VehicleRepository(ApplicationDbContext dbContext) : IVehicleRepository
{
    public async Task<Vehicle> AddAsync(Vehicle vehicle, CancellationToken cancellationToken)
    {
        dbContext.Vehicles.Add(vehicle);
        await dbContext.SaveChangesAsync(cancellationToken);
        return vehicle;
    }

    public Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Vehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(vehicle => vehicle.Id == id && !vehicle.IsDeleted, cancellationToken);
    }

    public Task<Vehicle?> GetByVinAsync(string vin, CancellationToken cancellationToken)
    {
        var normalizedVin = vin.Trim().ToUpperInvariant();

        return dbContext.Vehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(
                vehicle => vehicle.Vin == normalizedVin && !vehicle.IsDeleted,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Vehicle>> GetPageAsync(
        PageRequest page,
        Guid? ownerCustomerId,
        string? vin,
        CancellationToken cancellationToken)
    {
        var query = dbContext.Vehicles
            .AsNoTracking()
            .Where(vehicle => !vehicle.IsDeleted);

        if (ownerCustomerId.HasValue)
        {
            query = query.Where(vehicle => vehicle.OwnerCustomerId == ownerCustomerId.Value);
        }

        if (!string.IsNullOrWhiteSpace(vin))
        {
            var normalizedVin = vin.Trim().ToUpperInvariant();
            query = query.Where(vehicle => vehicle.Vin != null && vehicle.Vin.Contains(normalizedVin));
        }

        var vehicles = await query
            .OrderBy(vehicle => vehicle.LicensePlate)
            .Skip(page.Skip)
            .Take(page.Take)
            .ToListAsync(cancellationToken);

        return vehicles;
    }

    public Task<int> CountAsync(
        Guid? ownerCustomerId,
        string? vin,
        CancellationToken cancellationToken)
    {
        var query = dbContext.Vehicles
            .Where(vehicle => !vehicle.IsDeleted);

        if (ownerCustomerId.HasValue)
        {
            query = query.Where(vehicle => vehicle.OwnerCustomerId == ownerCustomerId.Value);
        }

        if (!string.IsNullOrWhiteSpace(vin))
        {
            var normalizedVin = vin.Trim().ToUpperInvariant();
            query = query.Where(vehicle => vehicle.Vin != null && vehicle.Vin.Contains(normalizedVin));
        }

        return query.CountAsync(cancellationToken);
    }

    public Task UpdateAsync(Vehicle vehicle, CancellationToken cancellationToken)
    {
        dbContext.Vehicles.Update(vehicle);
        return dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var vehicle = await dbContext.Vehicles
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (vehicle is null)
        {
            return false;
        }

        vehicle.IsDeleted = true;
        vehicle.DeletedAt = DateTime.UtcNow;
        vehicle.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
