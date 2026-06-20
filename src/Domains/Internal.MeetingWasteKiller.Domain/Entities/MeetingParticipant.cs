namespace Internal.MeetingWasteKiller.Domain.Entities;

public class MeetingParticipant
{
    public Guid MeetingId { get; set; }
    public Guid UserId { get; set; }

    public Meeting Meeting { get; set; } = null!;
    public User User { get; set; } = null!;
}
