using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Internal.MeetingWasteKiller.SqlServer;

internal sealed class MeetingWasteKillerDbContextFactory : IDesignTimeDbContextFactory<MeetingWasteKillerDbContext>
{
    public MeetingWasteKillerDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<MeetingWasteKillerDbContext>();
        optionsBuilder.UseSqlServer("Server=.;Database=MeetingWasteKiller;Trusted_Connection=True;");
        return new MeetingWasteKillerDbContext(optionsBuilder.Options);
    }
}
