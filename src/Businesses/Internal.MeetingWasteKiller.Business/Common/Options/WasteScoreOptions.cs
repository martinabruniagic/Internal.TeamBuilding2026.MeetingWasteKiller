namespace Internal.MeetingWasteKiller.Business.Common;

public sealed class WasteScoreOptions
{
    public const string SectionName = "WasteScore";
    public int AlertThreshold { get; set; } = 60;

    public void Validate()
    {
        if (AlertThreshold <= 0 || AlertThreshold > 100)
            throw new InvalidOperationException(
                "WasteScoreOptions: AlertThreshold must be between 1 and 100.");
    }
}
