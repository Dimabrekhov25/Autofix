using FluentValidation;

namespace Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItemById;

/// <summary>
/// Validation for <see cref="GetServiceCatalogItemByIdQuery"/>.
/// </summary>
public sealed class GetServiceCatalogItemByIdQueryValidator : AbstractValidator<GetServiceCatalogItemByIdQuery>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public GetServiceCatalogItemByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
