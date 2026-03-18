using FluentValidation;

namespace Autofix.Application.Users.Commands.CreateUser;

public sealed class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .Must(username => !string.IsNullOrWhiteSpace(username))
            .WithMessage("Username must not be empty or whitespace.");

        RuleFor(x => x.PasswordHash)
            .NotEmpty()
            .Must(passwordHash => !string.IsNullOrWhiteSpace(passwordHash))
            .WithMessage("Password hash must not be empty or whitespace.");

        RuleFor(x => x.Role)
            .IsInEnum();
    }
}
