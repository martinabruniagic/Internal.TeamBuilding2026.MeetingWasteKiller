namespace Internal.MeetingWasteKiller.Business.MeetingFeature;

public record ParticipantDto(Guid UserId, string Name, string Role, decimal DailyCost);
