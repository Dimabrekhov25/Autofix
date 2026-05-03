namespace Autofix.Application.Common.Interfaces.IUnitOfWokr;

/// <summary>
/// Unit-of-work boundary for persisting aggregate changes in one transaction.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>Saves pending changes; returns affected row count from the provider.</summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
