using FluentValidation;

namespace Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderPartItem;

/// <summary>
/// Validation for <see cref="RemoveServiceOrderPartItemCommand"/>.
/// </summary>
public sealed class RemoveServiceOrderPartItemCommandValidator : AbstractValidator<RemoveServiceOrderPartItemCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public RemoveServiceOrderPartItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.PartItemId)
            .NotEmpty();
    }
}
