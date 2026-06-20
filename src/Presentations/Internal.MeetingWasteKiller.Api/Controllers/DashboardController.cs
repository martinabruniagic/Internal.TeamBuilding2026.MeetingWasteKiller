using Internal.MeetingWasteKiller.Business.DashboardFeature;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Internal.MeetingWasteKiller.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public sealed class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<DashboardDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetKpis()
    {
        var kpis = await dashboardService.GetKpisAsync();
        return Ok(kpis);
    }
}
