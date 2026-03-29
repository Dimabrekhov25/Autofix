namespace Autofix.Domain.Enum;

public enum ServiceOrderStatus
{
    Created = 1,
    InDiagnosis = 2,
    WaitingCustomerApproval = 3,
    ApprovedInRepair = 4,
    ReadyForPickup = 5,
    Completed = 6
}
