using Internal.MeetingWasteKiller.Business.AuthFeature;
using Microsoft.AspNetCore.Mvc;

namespace Internal.MeetingWasteKiller.Api.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType<LoginResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var response = await authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }
}
