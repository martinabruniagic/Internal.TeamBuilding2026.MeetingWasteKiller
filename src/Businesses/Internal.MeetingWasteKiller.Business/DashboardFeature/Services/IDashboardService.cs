namespace Internal.MeetingWasteKiller.Business.DashboardFeature;

public interface IDashboardService
{
    Task<DashboardDto> GetKpisAsync();
}
