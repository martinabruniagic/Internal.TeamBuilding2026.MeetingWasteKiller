using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Internal.MeetingWasteKiller.Business.AuthFeature;

public sealed class AuthService(IConfiguration configuration)
{
    private static readonly List<(string Email, string Password, string Role)> HardcodedUsers =
    [
        ("martina@company.com", "password", "Manager"),
        ("dev@company.com", "password", "Developer")
    ];

    public Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = HardcodedUsers.FirstOrDefault(
            u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));

        if (user == default || user.Password != request.Password)
            throw new UnauthorizedAccessException("Invalid credentials");

        var expiresAt = DateTime.UtcNow.AddHours(int.Parse(configuration["Jwt:ExpiryHours"]!));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        Claim[] claims =
        [
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        ];

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Task.FromResult(new LoginResponseDto(tokenString, expiresAt));
    }
}
