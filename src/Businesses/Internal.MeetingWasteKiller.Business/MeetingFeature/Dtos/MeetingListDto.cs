namespace Internal.MeetingWasteKiller.Business.MeetingFeature;

public record MeetingListDto(
    Guid Id,
    string Title,
    DateTime Date,
    int DurationMinutes,
    decimal WasteScore,
    string WasteReason,
    bool IsAlert,
    bool IsFuture,
    int ParticipantCount);
