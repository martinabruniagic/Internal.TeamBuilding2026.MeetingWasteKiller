using Internal.MeetingWasteKiller.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Internal.MeetingWasteKiller.SqlServer;

internal sealed class MeetingWasteKillerDbContext(DbContextOptions<MeetingWasteKillerDbContext> options)
    : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Meeting> Meetings => Set<Meeting>();
    public DbSet<MeetingParticipant> MeetingParticipants => Set<MeetingParticipant>();
    public DbSet<Attachment> Attachments => Set<Attachment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MeetingParticipant>()
            .HasKey(mp => new { mp.MeetingId, mp.UserId });

        modelBuilder.Entity<MeetingParticipant>()
            .HasOne(mp => mp.Meeting)
            .WithMany(m => m.Participants)
            .HasForeignKey(mp => mp.MeetingId);

        modelBuilder.Entity<MeetingParticipant>()
            .HasOne(mp => mp.User)
            .WithMany(u => u.MeetingParticipants)
            .HasForeignKey(mp => mp.UserId);

        modelBuilder.Entity<Attachment>()
            .HasOne(a => a.Meeting)
            .WithMany(m => m.Attachments)
            .HasForeignKey(a => a.MeetingId);

        DataSeeder.Seed(modelBuilder);
    }
}
