namespace Internal.MeetingWasteKiller.Business.DashboardFeature;

public record DashboardDto(
    int TotalMeetings,
    decimal AvgWasteScore,
    decimal PercentMeetingsBelowThreshold,
    decimal TotalWastedCost,
    int Threshold,
    int AlertCount);
