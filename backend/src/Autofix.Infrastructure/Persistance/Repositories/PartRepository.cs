using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Inventory;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class PartRepository(ApplicationDbContext dbContext) : IPartRepository
{
    public async Task<Part> AddAsync(Part part, CancellationToken cancellationToken)
    {
        dbContext.Parts.Add(part);
        await dbContext.SaveChangesAsync(cancellationToken);
        return part;
    }

    public Task<Part?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Parts
            .AsNoTracking()
            .FirstOrDefaultAsync(part => part.Id == id && !part.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<Part>> GetAllAsync(CancellationToken cancellationToken)
    {
        var parts = await dbContext.Parts
            .AsNoTracking()
            .Where(part => !part.IsDeleted)
            .OrderBy(part => part.Name)
            .ToListAsync(cancellationToken);

        return parts;
    }

    public Task UpdateAsync(Part part, CancellationToken cancellationToken)
    {
        dbContext.Parts.Update(part);
        return dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var part = await dbContext.Parts
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

        if (part is null)
        {
            return false;
        }

        part.IsDeleted = true;
        part.DeletedAt = DateTime.UtcNow;
        part.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
