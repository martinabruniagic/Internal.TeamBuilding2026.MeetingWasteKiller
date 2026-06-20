using Internal.MeetingWasteKiller.Domain.Entities;

namespace Internal.MeetingWasteKiller.Domain.Interfaces;

public interface IMeetingRepository
{
    Task<IEnumerable<Meeting>> GetAllAsync(bool? isFuture = null, bool onlyAlerts = false);
    Task<Meeting?> GetByIdAsync(Guid id);
}
