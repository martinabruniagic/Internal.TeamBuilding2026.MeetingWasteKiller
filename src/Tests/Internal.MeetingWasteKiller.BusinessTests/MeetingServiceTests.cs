using FluentAssertions;
using Internal.MeetingWasteKiller.Business.Common;
using Internal.MeetingWasteKiller.Business.MeetingFeature;
using Internal.MeetingWasteKiller.Domain.Entities;
using Internal.MeetingWasteKiller.Domain.Interfaces;
using Microsoft.Extensions.Options;
using NSubstitute;
using Xunit;

namespace Internal.MeetingWasteKiller.BusinessTests;

public sealed class MeetingServiceTests
{
    [Theory]
    [InlineData(80, true)]
    [InlineData(15, false)]
    [InlineData(60, false)]
    [InlineData(61, true)]
    [InlineData(100, true)]
    public async Task GetAll_ReturnsMeetingsWithCorrectIsAlert(
        decimal wasteScore,
        bool expectedIsAlert)
    {
        var repository = Substitute.For<IMeetingRepository>();
        var options = Options.Create(new WasteScoreOptions { AlertThreshold = 60 });

        var meeting = new Meeting
        {
            Id = Guid.NewGuid(),
            Title = "Test Meeting",
            Date = DateTime.UtcNow.AddDays(-1),
            DurationMinutes = 60,
            Summary = "Summary",
            WasteScore = wasteScore,
            WasteReason = "Waste reason",
            IsAlert = expectedIsAlert,
            IsFuture = false
        };

        repository
            .GetAllAsync(Arg.Any<bool?>(), Arg.Any<bool>())
            .Returns([meeting]);

        var service = new MeetingService(repository, options);

        var result = (await service.GetAllAsync(null, false)).ToList();

        result.Should().HaveCount(1);
        result[0].IsAlert.Should().Be(expectedIsAlert);
    }

    [Theory]
    [InlineData(60, 800, 600, 175.00)]
    [InlineData(90, 800, 600, 262.50)]
    [InlineData(30, 350, 350, 43.75)]
    public async Task GetById_ReturnsCorrectEstimatedCost(
        int durationMinutes,
        double dailyCost1,
        double dailyCost2,
        double expectedCost)
    {
        var repository = Substitute.For<IMeetingRepository>();
        var options = Options.Create(new WasteScoreOptions { AlertThreshold = 60 });

        var meetingId = Guid.NewGuid();

        var user1 = new User { Id = Guid.NewGuid(), Name = "User One", Role = "Manager", DailyCost = (decimal)dailyCost1 };
        var user2 = new User { Id = Guid.NewGuid(), Name = "User Two", Role = "Developer", DailyCost = (decimal)dailyCost2 };

        var meeting = new Meeting
        {
            Id = meetingId,
            Title = "Cost Test Meeting",
            Date = DateTime.UtcNow.AddDays(-1),
            DurationMinutes = durationMinutes,
            Summary = "Summary",
            WasteScore = 50,
            WasteReason = "No reason",
            IsAlert = false,
            IsFuture = false,
            Participants =
            [
                new MeetingParticipant { MeetingId = meetingId, UserId = user1.Id, User = user1 },
                new MeetingParticipant { MeetingId = meetingId, UserId = user2.Id, User = user2 }
            ]
        };

        repository
            .GetByIdAsync(meetingId)
            .Returns(meeting);

        var service = new MeetingService(repository, options);

        var result = await service.GetByIdAsync(meetingId);

        result.Should().NotBeNull();
        result!.EstimatedCost.Should().Be((decimal)expectedCost);
    }
}
