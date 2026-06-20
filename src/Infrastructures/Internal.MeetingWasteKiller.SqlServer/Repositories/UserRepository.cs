using Internal.MeetingWasteKiller.Domain.Entities;
using Internal.MeetingWasteKiller.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Internal.MeetingWasteKiller.SqlServer;

internal sealed class UserRepository(MeetingWasteKillerDbContext context) : IUserRepository
{
    /// <inheritdoc/>
    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await context.Users.ToListAsync();
    }

    /// <inheritdoc/>
    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }
}
