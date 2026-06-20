using Internal.MeetingWasteKiller.Domain.Entities;

namespace Internal.MeetingWasteKiller.Domain.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(Guid id);
}
