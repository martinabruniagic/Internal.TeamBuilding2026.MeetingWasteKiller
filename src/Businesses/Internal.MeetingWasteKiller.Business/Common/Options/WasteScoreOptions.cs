namespace Internal.MeetingWasteKiller.Business.Common;

public sealed class WasteScoreOptions
{
    public const string SectionName = "WasteScore";
    public int AlertThreshold { get; set; } = 60;
}
