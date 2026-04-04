using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.AddServiceOrderCatalogItems;

public sealed class AddServiceOrderCatalogItemsCommandValidator : AbstractValidator<AddServiceOrderCatalogItemsCommand>
{
    public AddServiceOrderCatalogItemsCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.ServiceCatalogItemIds)
            .NotNull()
            .Must(ids => ids is { Count: > 0 })
            .WithMessage("At least one service must be selected.");

        RuleForEach(x => x.ServiceCatalogItemIds)
            .NotEmpty();
    }
}
