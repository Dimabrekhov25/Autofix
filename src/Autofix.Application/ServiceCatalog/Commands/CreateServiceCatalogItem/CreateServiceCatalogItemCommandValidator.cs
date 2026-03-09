using FluentValidation;

namespace Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;

public sealed class CreateServiceCatalogItemCommandValidator : AbstractValidator<CreateServiceCatalogItemCommand>
{
    public CreateServiceCatalogItemCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .Must(name => !string.IsNullOrWhiteSpace(name))
            .WithMessage("Name must not be empty or whitespace.")
            .MinimumLength(2)
            .MaximumLength(200);

        RuleFor(x => x.BasePrice)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.EstimatedDuration)
            .GreaterThan(TimeSpan.Zero);
    }
}
