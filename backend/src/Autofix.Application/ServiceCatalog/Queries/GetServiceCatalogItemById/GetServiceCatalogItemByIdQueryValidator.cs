using FluentValidation;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItemById;

public sealed class GetServiceCatalogItemByIdQueryValidator : AbstractValidator<GetServiceCatalogItemByIdQuery>
{
    public GetServiceCatalogItemByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
