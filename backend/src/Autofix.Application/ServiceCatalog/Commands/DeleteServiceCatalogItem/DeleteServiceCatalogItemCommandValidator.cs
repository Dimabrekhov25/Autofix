using FluentValidation;

namespace Autofix.Application.ServiceCatalog.Commands.DeleteServiceCatalogItem;

/// <summary>
/// Validation for <see cref="DeleteServiceCatalogItemCommand"/>.
/// </summary>
public sealed class DeleteServiceCatalogItemCommandValidator : AbstractValidator<DeleteServiceCatalogItemCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public DeleteServiceCatalogItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
