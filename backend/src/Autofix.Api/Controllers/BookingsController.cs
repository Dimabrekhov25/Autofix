using Autofix.Api.Models;
using Autofix.Application.Bookings.Commands.ApproveBookingEstimate;
using Autofix.Application.Bookings.Commands.CreateBooking;
using Autofix.Application.Bookings.Commands.DeleteBooking;
using Autofix.Application.Bookings.Commands.RequestBookingChanges;
using Autofix.Application.Bookings.Commands.UpdateBooking;
using Autofix.Application.Bookings.Commands.UpdateBookingPaymentOption;
using Autofix.Application.Bookings.Commands.UpdateBookingServiceOrderStatus;
using Autofix.Application.Bookings.Queries.GetAvailableBookingSlots;
using Autofix.Application.Bookings.Queries.GetBookingById;
using Autofix.Application.Bookings.Queries.GetBookingQuote;
using Autofix.Application.Bookings.Queries.GetCurrentUserBookings;
using Autofix.Application.Bookings.Queries.GetBookings;
using Autofix.Application.Common.Security;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

/// <summary>
/// Exposes booking-related API endpoints and delegates business logic to MediatR handlers.
/// </summary>
public sealed class BookingsController(IMediator mediator) : BaseController
{
    /// <summary>
    /// Creates a new booking from the provided request payload.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns a paginated and/or filtered list of bookings.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetBookingsQuery query, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns bookings that belong to the currently authenticated user.
    /// </summary>
    [Authorize(Policy = PolicyNames.ActiveUser)]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookings(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetCurrentUserBookingsQuery(), cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Calculates and returns a booking quote for the provided request details.
    /// </summary>
    [HttpPost("quote")]
    public async Task<IActionResult> GetQuote(
        [FromBody] GetBookingQuoteQuery query,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns available booking time slots that match the supplied criteria.
    /// </summary>
    [HttpGet("slots")]
    public async Task<IActionResult> GetAvailableSlots(
        [FromQuery] GetAvailableBookingSlotsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns a single booking by its identifier, or 404 if it does not exist.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetBookingByIdQuery(id), cancellationToken);

        // Handler returns null when no booking matches the id.
        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Updates an existing booking. The route id must match <see cref="UpdateBookingCommand.Id"/> in the body.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateBookingCommand command,
        CancellationToken cancellationToken)
    {
        // Avoid applying updates to the wrong entity when client sends mismatched ids.
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Deletes a booking by id. Returns 404 when the booking is missing.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteBookingCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        // Empty object signals success with no response body fields beyond the standard envelope.
        return OkResult(new { });
    }

    [Authorize(Policy = PolicyNames.ActiveUser)]
    [HttpPost("{id:guid}/approve-estimate")]
    public async Task<IActionResult> ApproveEstimate(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new ApproveBookingEstimateCommand(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
    }

    [Authorize(Policy = PolicyNames.ActiveUser)]
    [HttpPost("{id:guid}/request-changes")]
    public async Task<IActionResult> RequestChanges(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new RequestBookingChangesCommand(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
    }

    [Authorize(Policy = PolicyNames.ActiveUser)]
    [HttpPut("{id:guid}/payment-option")]
    public async Task<IActionResult> UpdatePaymentOption(
        Guid id,
        [FromBody] UpdateBookingPaymentOptionCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
    }

    [Authorize(Policy = PolicyNames.AdminOnly)]
    [HttpPut("{id:guid}/service-order-status")]
    public async Task<IActionResult> UpdateServiceOrderStatus(
        Guid id,
        [FromBody] UpdateBookingServiceOrderStatusCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
    }
}
