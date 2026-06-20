using FluentAssertions;
using Internal.MeetingWasteKiller.Business.AuthFeature;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Internal.MeetingWasteKiller.BusinessTests;

public sealed class AuthServiceTests
{
    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        var configuration = BuildConfiguration();
        var service = new AuthService(configuration);

        var result = await service.LoginAsync(new LoginRequestDto("martina@company.com", "password"));

        result.Should().NotBeNull();
        result.Token.Should().NotBeEmpty();
        result.ExpiresAt.Should().BeAfter(DateTime.UtcNow);
    }

    [Theory]
    [InlineData("wrong@email.com", "password")]
    [InlineData("martina@company.com", "wrongpassword")]
    [InlineData("", "")]
    public async Task Login_WithInvalidCredentials_ThrowsUnauthorizedAccessException(
        string email,
        string password)
    {
        var configuration = BuildConfiguration();
        var service = new AuthService(configuration);

        var act = async () => await service.LoginAsync(new LoginRequestDto(email, password));

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    private static IConfiguration BuildConfiguration()
    {
        var configData = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "MeetingWasteKiller_SuperSecretKey_32chars!",
            ["Jwt:Issuer"] = "MeetingWasteKiller",
            ["Jwt:Audience"] = "MeetingWasteKillerClient",
            ["Jwt:ExpiryHours"] = "8"
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(configData)
            .Build();
    }
}
