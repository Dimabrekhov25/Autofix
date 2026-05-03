using FluentValidation;

namespace Autofix.Application.Bookings.Commands.UpdateBookingPaymentOption;

/// <summary>
/// FluentValidation rules for <see cref="UpdateBookingPaymentOptionCommand"/>.
/// </summary>
public sealed class UpdateBookingPaymentOptionCommandValidator : AbstractValidator<UpdateBookingPaymentOptionCommand>
{
    /// <summary>
    /// Configures validation rules applied before the handler runs.
    /// </summary>
    public UpdateBookingPaymentOptionCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.PaymentOption)
            .IsInEnum();
    }
}
