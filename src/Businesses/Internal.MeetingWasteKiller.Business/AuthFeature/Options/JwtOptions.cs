namespace Internal.MeetingWasteKiller.Business.AuthFeature;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpiryHours { get; set; } = 8;

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(Key) || Key.Length < 32)
            throw new InvalidOperationException("JwtOptions: Key must be at least 32 characters.");

        if (string.IsNullOrWhiteSpace(Issuer))
            throw new InvalidOperationException("JwtOptions: Issuer is required.");

        if (string.IsNullOrWhiteSpace(Audience))
            throw new InvalidOperationException("JwtOptions: Audience is required.");

        if (ExpiryHours <= 0)
            throw new InvalidOperationException("JwtOptions: ExpiryHours must be greater than 0.");
    }
}
