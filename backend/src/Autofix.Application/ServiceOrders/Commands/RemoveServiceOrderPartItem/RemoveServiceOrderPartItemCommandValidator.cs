using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderPartItem;

public sealed class RemoveServiceOrderPartItemCommandValidator : AbstractValidator<RemoveServiceOrderPartItemCommand>
{
    public RemoveServiceOrderPartItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.PartItemId)
            .NotEmpty();
    }
}
