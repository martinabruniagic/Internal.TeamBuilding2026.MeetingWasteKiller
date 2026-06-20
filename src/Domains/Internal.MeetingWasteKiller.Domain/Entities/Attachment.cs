namespace Internal.MeetingWasteKiller.Domain.Entities;

public class Attachment
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string BlobUrl { get; set; } = string.Empty;

    public Meeting Meeting { get; set; } = null!;
}
