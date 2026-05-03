using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.MarkCustomerApprovalNotificationRead;

/// <summary>
/// Validation for <see cref="MarkCustomerApprovalNotificationReadCommand"/>.
/// </summary>
public sealed class MarkCustomerApprovalNotificationReadCommandValidator
    : AbstractValidator<MarkCustomerApprovalNotificationReadCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public MarkCustomerApprovalNotificationReadCommandValidator()
    {
        RuleFor(x => x.ServiceOrderId)
            .NotEmpty();
    }
}
