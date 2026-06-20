using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Internal.MeetingWasteKiller.Api.Controllers;

[ApiController]
[ApiExplorerSettings(IgnoreApi = true)]
public sealed class ErrorController : ControllerBase
{
    [Route("/error")]
    public IActionResult HandleError()
    {
        var exception = HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;

        return exception switch
        {
            ArgumentException => BadRequest(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            }),
            _ => Problem(
                title: "An unexpected error occurred.",
                statusCode: StatusCodes.Status500InternalServerError)
        };
    }
}
