using Internal.MeetingWasteKiller.Domain.Entities;
using Internal.MeetingWasteKiller.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Internal.MeetingWasteKiller.SqlServer;

internal sealed class MeetingRepository(MeetingWasteKillerDbContext context) : IMeetingRepository
{
    /// <inheritdoc/>
    public async Task<IEnumerable<Meeting>> GetAllAsync(bool? isFuture = null, bool onlyAlerts = false)
    {
        var query = context.Meetings
            .Include(m => m.Participants)
            .AsQueryable();

        if (isFuture is not null)
            query = query.Where(m => m.IsFuture == isFuture.Value);

        if (onlyAlerts)
            query = query.Where(m => m.IsAlert);

        return await query.ToListAsync();
    }

    /// <inheritdoc/>
    public async Task<Meeting?> GetByIdAsync(Guid id)
    {
        return await context.Meetings
            .Include(m => m.Participants)
                .ThenInclude(mp => mp.User)
            .Include(m => m.Attachments)
            .FirstOrDefaultAsync(m => m.Id == id);
    }
}
