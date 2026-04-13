using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderWorkItem;

public sealed class RemoveServiceOrderWorkItemCommandValidator : AbstractValidator<RemoveServiceOrderWorkItemCommand>
{
    public RemoveServiceOrderWorkItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.WorkItemId)
            .NotEmpty();
    }
}
