using FluentValidation;

namespace Autofix.Application.ServiceCatalog.Commands.DeleteServiceCatalogItem;

public sealed class DeleteServiceCatalogItemCommandValidator : AbstractValidator<DeleteServiceCatalogItemCommand>
{
    public DeleteServiceCatalogItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
