using System.ComponentModel.DataAnnotations;

namespace Internal.MeetingWasteKiller.Business.AuthFeature;

public record LoginRequestDto(
    [Required][EmailAddress] string Email,
    [Required][MinLength(1)] string Password);
