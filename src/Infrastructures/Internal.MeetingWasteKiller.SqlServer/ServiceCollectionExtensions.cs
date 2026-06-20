using Internal.MeetingWasteKiller.Domain.Interfaces;
using Internal.MeetingWasteKiller.SqlServer;
using Internal.MeetingWasteKiller.SqlServer.Common;
using Microsoft.EntityFrameworkCore;

namespace Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSqlServerInfrastructure(
        this IServiceCollection services,
        Action<SqlServerOptions> configureOptions)
    {
        var options = new SqlServerOptions();
        configureOptions(options);
        options.Validate();

        services.AddDbContext<MeetingWasteKillerDbContext>(dbOptions =>
            dbOptions.UseSqlServer(options.ConnectionString));

        services.AddScoped<IMeetingRepository, MeetingRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}
