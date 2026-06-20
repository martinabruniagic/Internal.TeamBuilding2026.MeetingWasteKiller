using FluentAssertions;
using Internal.MeetingWasteKiller.Business.AuthFeature;
using Microsoft.Extensions.Options;
using Xunit;

namespace Internal.MeetingWasteKiller.BusinessTests;

public sealed class AuthServiceTests
{
    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        var service = new AuthService(BuildOptions());

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
        var service = new AuthService(BuildOptions());

        var act = async () => await service.LoginAsync(new LoginRequestDto(email, password));

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    private static IOptions<JwtOptions> BuildOptions() =>
        Options.Create(new JwtOptions
        {
            Key = "MeetingWasteKiller_SuperSecretKey_32chars!",
            Issuer = "MeetingWasteKiller",
            Audience = "MeetingWasteKillerClient",
            ExpiryHours = 8
        });
}
