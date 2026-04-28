using FluentValidation;

namespace Autofix.Application.Customers.Commands.UpdateCustomer;

public sealed class UpdateCustomerCommandValidator : AbstractValidator<UpdateCustomerCommand>
{
    public UpdateCustomerCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.FullName)
            .NotEmpty()
            .Must(name => !string.IsNullOrWhiteSpace(name))
            .WithMessage("Full name must not be empty or whitespace.")
            .MaximumLength(200);

        RuleFor(x => x.Phone)
            .NotEmpty()
            .Must(phone => !string.IsNullOrWhiteSpace(phone))
            .WithMessage("Phone must not be empty or whitespace.")
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .MaximumLength(320)
            .EmailAddress()
            // Email is optional, but if provided it must pass format and length checks.
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Notes)
            .MaximumLength(2000);
    }
}
