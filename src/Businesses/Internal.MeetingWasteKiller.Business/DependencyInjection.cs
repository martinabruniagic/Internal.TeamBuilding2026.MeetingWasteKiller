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
        var jwtOptions = new JwtOptions();
        configuration.GetSection(JwtOptions.SectionName).Bind(jwtOptions);
        jwtOptions.Validate();

        var wasteOptions = new WasteScoreOptions();
        configuration.GetSection(WasteScoreOptions.SectionName).Bind(wasteOptions);
        wasteOptions.Validate();

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<WasteScoreOptions>(
            configuration.GetSection(WasteScoreOptions.SectionName));

        services.AddScoped<IMeetingService, MeetingService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
