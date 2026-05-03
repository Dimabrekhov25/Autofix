using Autofix.Domain.Enum;
using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderStatus;

/// <summary>
/// Validation for <see cref="UpdateServiceOrderStatusCommand"/> (non-empty id, enum status).
/// </summary>
public sealed class UpdateServiceOrderStatusCommandValidator : AbstractValidator<UpdateServiceOrderStatusCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public UpdateServiceOrderStatusCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.Status)
            .IsInEnum();
    }
}
