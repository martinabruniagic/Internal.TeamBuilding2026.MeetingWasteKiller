using System.ComponentModel.DataAnnotations.Schema;

namespace Internal.MeetingWasteKiller.Domain.Entities;

public class Meeting
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int DurationMinutes { get; set; }
    public string Summary { get; set; } = string.Empty;
    public decimal WasteScore { get; set; }
    public string WasteReason { get; set; } = string.Empty;

    [NotMapped]
    public bool IsFuture => Date > DateTime.UtcNow;

    public bool IsAlert { get; set; }

    public ICollection<MeetingParticipant> Participants { get; set; } = [];
    public ICollection<Attachment> Attachments { get; set; } = [];
}
