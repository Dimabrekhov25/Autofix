namespace Autofix.Application.Common.Interfaces.CurrentUser;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? UserName { get; }
    string? Email { get; }
}
