using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderWorkItem;

/// <summary>
/// Validation for <see cref="RemoveServiceOrderWorkItemCommand"/>.
/// </summary>
public sealed class RemoveServiceOrderWorkItemCommandValidator : AbstractValidator<RemoveServiceOrderWorkItemCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public RemoveServiceOrderWorkItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.WorkItemId)
            .NotEmpty();
    }
}
