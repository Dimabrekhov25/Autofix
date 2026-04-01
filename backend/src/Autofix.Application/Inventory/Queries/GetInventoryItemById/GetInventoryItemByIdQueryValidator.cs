using FluentValidation;

namespace Autofix.Application.Inventory.Queries.GetInventoryItemById;

public sealed class GetInventoryItemByIdQueryValidator : AbstractValidator<GetInventoryItemByIdQuery>
{
    public GetInventoryItemByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
