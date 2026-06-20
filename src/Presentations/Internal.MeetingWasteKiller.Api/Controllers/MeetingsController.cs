using Internal.MeetingWasteKiller.Business.MeetingFeature;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Internal.MeetingWasteKiller.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public sealed class MeetingsController(IMeetingService meetingService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IEnumerable<MeetingListDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] bool? isFuture,
        [FromQuery] bool onlyAlerts = false)
    {
        var meetings = await meetingService.GetAllAsync(isFuture, onlyAlerts);
        return Ok(meetings);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<MeetingDetailDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var meeting = await meetingService.GetByIdAsync(id);
        return meeting is null ? NotFound() : Ok(meeting);
    }
}
