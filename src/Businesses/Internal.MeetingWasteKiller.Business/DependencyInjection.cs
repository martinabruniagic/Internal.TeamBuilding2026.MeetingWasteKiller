using Internal.MeetingWasteKiller.Business.AuthFeature;
using Internal.MeetingWasteKiller.Business.Common;
using Internal.MeetingWasteKiller.Business.DashboardFeature;
using Internal.MeetingWasteKiller.Business.MeetingFeature;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Internal.MeetingWasteKiller.Business;

public static class DependencyInjection
{
    public static IServiceCollection AddBusiness(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<WasteScoreOptions>(
            configuration.GetSection(WasteScoreOptions.SectionName));

        services.AddScoped<MeetingService>();
        services.AddScoped<DashboardService>();
        services.AddScoped<AuthService>();

        return services;
    }
}
