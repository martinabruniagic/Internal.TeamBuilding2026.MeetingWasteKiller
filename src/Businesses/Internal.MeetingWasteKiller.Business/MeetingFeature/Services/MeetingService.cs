using Internal.MeetingWasteKiller.Business.Common;
using Internal.MeetingWasteKiller.Domain.Interfaces;
using Microsoft.Extensions.Options;

namespace Internal.MeetingWasteKiller.Business.MeetingFeature;

public sealed class MeetingService(
    IMeetingRepository repository,
    IOptions<WasteScoreOptions> wasteOptions) : IMeetingService
{
    private readonly WasteScoreOptions _wasteOptions = wasteOptions.Value;

    public async Task<IEnumerable<MeetingListDto>> GetAllAsync(
        bool? isFuture,
        bool onlyAlerts)
    {
        var meetings = await repository.GetAllAsync(isFuture, onlyAlerts);

        return meetings.Select(m => new MeetingListDto(
            m.Id,
            m.Title,
            m.Date,
            m.DurationMinutes,
            m.WasteScore,
            m.WasteReason,
            m.IsAlert,
            m.IsFuture,
            m.Participants.Count));
    }

    public async Task<MeetingDetailDto?> GetByIdAsync(Guid id)
    {
        var meeting = await repository.GetByIdAsync(id);

        if (meeting is null)
            return null;

        var estimatedCost = meeting.Participants.Sum(
            p => p.User.DailyCost / 8 * (meeting.DurationMinutes / 60m));

        var participants = meeting.Participants.Select(
            p => new ParticipantDto(p.UserId, p.User.Name, p.User.Role, p.User.DailyCost));

        var attachments = meeting.Attachments.Select(
            a => new AttachmentDto(a.Id, a.FileName, a.BlobUrl));

        return new MeetingDetailDto(
            meeting.Id,
            meeting.Title,
            meeting.Date,
            meeting.DurationMinutes,
            meeting.Summary,
            meeting.WasteScore,
            meeting.WasteReason,
            meeting.IsAlert,
            meeting.IsFuture,
            estimatedCost,
            participants,
            attachments);
    }
}
