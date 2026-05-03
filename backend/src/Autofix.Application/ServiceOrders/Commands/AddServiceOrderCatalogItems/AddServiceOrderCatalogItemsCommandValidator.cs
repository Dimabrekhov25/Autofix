using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.AddServiceOrderCatalogItems;

/// <summary>
/// Validation for <see cref="AddServiceOrderCatalogItemsCommand"/>.
/// </summary>
public sealed class AddServiceOrderCatalogItemsCommandValidator : AbstractValidator<AddServiceOrderCatalogItemsCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
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
