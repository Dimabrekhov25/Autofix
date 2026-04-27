using FluentValidation;
using Autofix.Domain.Enum;

namespace Autofix.Application.ServiceCatalog.Commands.UpdateServiceCatalogItem;

public sealed class UpdateServiceCatalogItemCommandValidator : AbstractValidator<UpdateServiceCatalogItemCommand>
{
    public UpdateServiceCatalogItemCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.Name)
            .NotEmpty()
            .Must(name => !string.IsNullOrWhiteSpace(name))
            .WithMessage("Name must not be empty or whitespace.")
            .MinimumLength(2)
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.BasePrice)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.EstimatedLaborCost)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.EstimatedDuration)
            .GreaterThan(TimeSpan.Zero);

        RuleForEach(x => x.RequiredParts)
            .ChildRules(part =>
            {
                part.RuleFor(x => x.PartId)
                    .NotEmpty();

                part.RuleFor(x => x.Quantity)
                    .GreaterThan(0);
            });

        RuleFor(x => x)
            // Required parts are allowed only for real services, not diagnostic-only catalog entries.
            .Must(command => command.Category == ServiceCatalogCategory.Service || command.RequiredParts is not { Count: > 0 })
            .WithMessage("Diagnostic catalog items cannot have required parts.");
    }
}
