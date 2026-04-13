using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderWorkItem;

public sealed class UpdateServiceOrderWorkItemCommandValidator : AbstractValidator<UpdateServiceOrderWorkItemCommand>
{
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
