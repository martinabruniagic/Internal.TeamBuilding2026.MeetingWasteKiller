namespace Internal.MeetingWasteKiller.Business.MeetingFeature;

public record MeetingDetailDto(
    Guid Id,
    string Title,
    DateTime Date,
    int DurationMinutes,
    string Summary,
    decimal WasteScore,
    string WasteReason,
    bool IsAlert,
    bool IsFuture,
    decimal EstimatedCost,
    IEnumerable<ParticipantDto> Participants,
    IEnumerable<AttachmentDto> Attachments);
