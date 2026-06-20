namespace Internal.MeetingWasteKiller.Business.AuthFeature;

public record LoginResponseDto(string Token, DateTime ExpiresAt);
