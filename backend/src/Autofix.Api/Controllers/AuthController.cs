using Autofix.Api.Contracts.Auth;
using Autofix.Application.Auth.Commands.GoogleLogin;
using Autofix.Api.Models;
using Autofix.Application.Auth.Commands.Login;
using Autofix.Application.Auth.Commands.Logout;
using Autofix.Application.Auth.Commands.RefreshToken;
using Autofix.Application.Auth.Commands.Register;
using Autofix.Application.Auth.Queries.GetCurrentUser;
using Autofix.Application.Common.Security;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

/// <summary>
/// Authentication and session endpoints: registration, login, token refresh, and current-user profile.
/// </summary>
public sealed class AuthController(IMediator mediator) : BaseController
{
    /// <summary>
    /// Registers a new user account; returns credentials/tokens per application rules.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(
            new RegisterCommand(request.UserName, request.Email, request.FullName, request.Password),
            cancellationToken);

        return CreatedResult(result);
    }

    /// <summary>
    /// Authenticates with username/email and password; returns tokens on success.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(
            new LoginCommand(request.UserNameOrEmail, request.Password),
            cancellationToken);

        return OkResult(result);
    }

    /// <summary>
    /// Signs in using a Google ID token (e.g. from the client SDK).
    /// </summary>
    [AllowAnonymous]
    [HttpPost("google")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GoogleLogin(
        [FromBody] GoogleLoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GoogleLoginCommand(request.IdToken), cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Issues a new access token (and possibly refresh token) from a valid refresh token.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken(
        [FromBody] RefreshTokenRequest request,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new RefreshTokenCommand(request.RefreshToken), cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Revokes the given refresh token for the signed-in user.
    /// </summary>
    [Authorize(Policy = PolicyNames.ActiveUser)]
    [HttpPost("logout")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Logout(
        [FromBody] LogoutRequest request,
        CancellationToken cancellationToken)
    {
        await mediator.Send(new LogoutCommand(request.RefreshToken), cancellationToken);
        // Empty payload; success is still wrapped by ApiResult via OkResult.
        return OkResult(new { });
    }

    /// <summary>
    /// Returns the profile for the currently authenticated active user.
    /// </summary>
    [Authorize(Policy = PolicyNames.ActiveUser)]
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetCurrentUserQuery(), cancellationToken);
        return OkResult(result);
    }
}
