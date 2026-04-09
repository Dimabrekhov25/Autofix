using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.MarkCustomerApprovalNotificationRead;

public sealed class MarkCustomerApprovalNotificationReadCommandValidator
    : AbstractValidator<MarkCustomerApprovalNotificationReadCommand>
{
    public MarkCustomerApprovalNotificationReadCommandValidator()
    {
        RuleFor(x => x.ServiceOrderId)
            .NotEmpty();
    }
}
