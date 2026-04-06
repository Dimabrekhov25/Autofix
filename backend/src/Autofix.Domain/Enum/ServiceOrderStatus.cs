namespace Autofix.Domain.Enum;

public enum ServiceOrderStatus
{
    Pending = 1,
    AwaitingApproval = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5,
    ChangesRequested = 6,
    Approved = 7
}
