namespace Autofix.Application.Common.Interfaces.IUnitOfWokr;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
