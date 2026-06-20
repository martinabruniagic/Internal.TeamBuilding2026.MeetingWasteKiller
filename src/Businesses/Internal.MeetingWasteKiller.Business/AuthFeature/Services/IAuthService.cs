namespace Internal.MeetingWasteKiller.Business.AuthFeature;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}
