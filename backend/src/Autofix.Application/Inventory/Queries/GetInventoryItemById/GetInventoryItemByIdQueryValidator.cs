using FluentValidation;

namespace Autofix.Application.Inventory.Queries.GetInventoryItemById;

/// <summary>
/// Validation for <see cref="GetInventoryItemByIdQuery"/>.
/// </summary>
public sealed class GetInventoryItemByIdQueryValidator : AbstractValidator<GetInventoryItemByIdQuery>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public GetInventoryItemByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
