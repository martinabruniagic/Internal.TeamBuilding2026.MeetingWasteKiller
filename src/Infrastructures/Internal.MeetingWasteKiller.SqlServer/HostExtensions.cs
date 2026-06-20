using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Microsoft.Extensions.DependencyInjection;

public static class HostExtensions
{
    public static IServiceProvider ApplyMigrations(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        scope.ServiceProvider
            .GetRequiredService<global::Internal.MeetingWasteKiller.SqlServer.MeetingWasteKillerDbContext>()
            .Database.Migrate();

        return services;
    }
}
