using FluentAssertions;
using Internal.MeetingWasteKiller.Business.Common;
using Internal.MeetingWasteKiller.Business.DashboardFeature;
using Internal.MeetingWasteKiller.Domain.Entities;
using Internal.MeetingWasteKiller.Domain.Interfaces;
using Microsoft.Extensions.Options;
using NSubstitute;
using Xunit;

namespace Internal.MeetingWasteKiller.BusinessTests;

public sealed class DashboardServiceTests
{
    [Fact]
    public async Task GetKpis_ReturnsCorrectAggregates()
    {
        var repository = Substitute.For<IMeetingRepository>();
        var options = Options.Create(new WasteScoreOptions { AlertThreshold = 60 });

        var meetings = BuildMeetings();

        repository
            .GetAllAsync(Arg.Any<bool?>(), Arg.Any<bool>())
            .Returns(meetings);

        var service = new DashboardService(repository, options);

        var result = await service.GetKpisAsync();

        result.TotalMeetings.Should().Be(5);
        result.AvgWasteScore.Should().Be(56.00m);
        result.AlertCount.Should().Be(3);
        result.PercentMeetingsBelowThreshold.Should().Be(40.00m);
        result.TotalWastedCost.Should().Be(525.00m);
    }

    private static IEnumerable<Meeting> BuildMeetings()
    {
        var scores = new[] { (80m, true), (65m, true), (30m, false), (15m, false), (90m, true) };

        return scores.Select(entry =>
        {
            var (score, isAlert) = entry;
            var meetingId = Guid.NewGuid();

            var user1 = new User { Id = Guid.NewGuid(), Name = "Alice", Role = "Manager", DailyCost = 800m };
            var user2 = new User { Id = Guid.NewGuid(), Name = "Bob", Role = "Developer", DailyCost = 600m };

            return new Meeting
            {
                Id = meetingId,
                Title = $"Meeting {score}",
                Date = DateTime.UtcNow.AddDays(-1),
                DurationMinutes = 60,
                Summary = "Summary",
                WasteScore = score,
                WasteReason = "Reason",
                IsAlert = isAlert,
                IsFuture = false,
                Participants =
                [
                    new MeetingParticipant { MeetingId = meetingId, UserId = user1.Id, User = user1 },
                    new MeetingParticipant { MeetingId = meetingId, UserId = user2.Id, User = user2 }
                ]
            };
        });
    }
}
