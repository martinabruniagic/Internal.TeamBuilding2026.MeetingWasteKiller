using Internal.MeetingWasteKiller.Business.Common;
using Internal.MeetingWasteKiller.Domain.Interfaces;
using Microsoft.Extensions.Options;

namespace Internal.MeetingWasteKiller.Business.DashboardFeature;

public sealed class DashboardService(
    IMeetingRepository repository,
    IOptions<WasteScoreOptions> wasteOptions)
{
    public async Task<DashboardDto> GetKpisAsync()
    {
        var meetings = (await repository.GetAllAsync()).ToList();
        var threshold = wasteOptions.Value.AlertThreshold;

        var totalMeetings = meetings.Count;

        var avgWasteScore = totalMeetings > 0
            ? Math.Round(meetings.Average(m => m.WasteScore), 2)
            : 0m;

        var belowThreshold = meetings.Count(m => m.WasteScore <= threshold);
        var percentBelowThreshold = totalMeetings > 0
            ? Math.Round((decimal)belowThreshold / totalMeetings * 100, 2)
            : 0m;

        var alertMeetings = meetings.Where(m => m.IsAlert).ToList();

        var totalWastedCost = alertMeetings.Sum(
            m => m.Participants.Sum(p => p.User.DailyCost / 8 * (m.DurationMinutes / 60m)));

        var alertCount = alertMeetings.Count;

        return new DashboardDto(
            totalMeetings,
            avgWasteScore,
            percentBelowThreshold,
            totalWastedCost,
            threshold,
            alertCount);
    }
}
