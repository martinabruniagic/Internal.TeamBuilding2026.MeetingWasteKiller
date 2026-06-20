namespace Internal.MeetingWasteKiller.Business.MeetingFeature;

public interface IMeetingService
{
    Task<IEnumerable<MeetingListDto>> GetAllAsync(bool? isFuture, bool onlyAlerts);
    Task<MeetingDetailDto?> GetByIdAsync(Guid id);
}
