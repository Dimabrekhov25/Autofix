using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderWorkItem;

/// <summary>
/// Validation for <see cref="UpdateServiceOrderWorkItemCommand"/>.
/// </summary>
public sealed class UpdateServiceOrderWorkItemCommandValidator : AbstractValidator<UpdateServiceOrderWorkItemCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public UpdateServiceOrderWorkItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.WorkItemId)
            .NotEmpty();

        RuleFor(x => x.LaborHours)
            .GreaterThan(0);

        RuleFor(x => x.HourlyRate)
            .GreaterThan(0);
    }
}
