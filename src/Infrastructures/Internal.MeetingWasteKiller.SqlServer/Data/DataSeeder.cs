using Internal.MeetingWasteKiller.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Internal.MeetingWasteKiller.SqlServer;

internal static class DataSeeder
{
    private static readonly Guid ManagerId    = new("11111111-1111-1111-1111-111111111111");
    private static readonly Guid SeniorDevId  = new("22222222-2222-2222-2222-222222222222");
    private static readonly Guid JuniorDevId  = new("33333333-3333-3333-3333-333333333333");

    private static readonly Guid SprintPlanningId      = new("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid DailyStandupId        = new("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    private static readonly Guid ArchReviewId          = new("cccccccc-cccc-cccc-cccc-cccccccccccc");
    private static readonly Guid TeamRetroId           = new("dddddddd-dddd-dddd-dddd-dddddddddddd");
    private static readonly Guid EmergencyBugId        = new("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee");
    private static readonly Guid Q3PlanningId          = new("ffffffff-ffff-ffff-ffff-ffffffffffff");
    private static readonly Guid TeamSyncId            = new("00000001-0000-0000-0000-000000000001");

    internal static void Seed(ModelBuilder modelBuilder)
    {
        SeedUsers(modelBuilder);
        SeedMeetings(modelBuilder);
        SeedParticipants(modelBuilder);
        SeedAttachments(modelBuilder);
    }

    private static void SeedUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id        = ManagerId,
                Name      = "Mario Rossi",
                Email     = "martina@company.com",
                Role      = "Manager",
                DailyCost = 800
            },
            new User
            {
                Id        = SeniorDevId,
                Name      = "Luca Bianchi",
                Email     = "dev@company.com",
                Role      = "Senior Dev",
                DailyCost = 600
            },
            new User
            {
                Id        = JuniorDevId,
                Name      = "Sara Verdi",
                Email     = "junior@company.com",
                Role      = "Junior Dev",
                DailyCost = 350
            }
        );
    }

    private static void SeedMeetings(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Meeting>().HasData(
            new Meeting
            {
                Id              = SprintPlanningId,
                Title           = "Sprint Planning",
                Date            = new DateTime(2026, 5, 15, 9, 0, 0, DateTimeKind.Utc),
                DurationMinutes = 90,
                Summary         = "Sprint planning per il Q2. Definizione backlog e stime.",
                WasteScore      = 80,
                WasteReason     = "Troppi partecipanti, durata eccessiva rispetto al valore prodotto.",
                IsAlert         = true
            },
            new Meeting
            {
                Id              = DailyStandupId,
                Title           = "Daily Standup",
                Date            = new DateTime(2026, 6, 1, 9, 30, 0, DateTimeKind.Utc),
                DurationMinutes = 30,
                Summary         = "Sincronizzazione quotidiana del team di sviluppo.",
                WasteScore      = 15,
                WasteReason     = "Meeting efficiente, breve e focalizzato.",
                IsAlert         = false
            },
            new Meeting
            {
                Id              = ArchReviewId,
                Title           = "Architecture Review",
                Date            = new DateTime(2026, 5, 20, 14, 0, 0, DateTimeKind.Utc),
                DurationMinutes = 120,
                Summary         = "Revisione dell'architettura del sistema di autenticazione.",
                WasteScore      = 65,
                WasteReason     = "Discussioni circolari senza decisioni concrete.",
                IsAlert         = true
            },
            new Meeting
            {
                Id              = TeamRetroId,
                Title           = "Team Retrospective",
                Date            = new DateTime(2026, 6, 10, 15, 0, 0, DateTimeKind.Utc),
                DurationMinutes = 60,
                Summary         = "Retrospettiva di fine sprint: punti positivi e aree di miglioramento.",
                WasteScore      = 30,
                WasteReason     = "Meeting produttivo con azioni concrete identificate.",
                IsAlert         = false
            },
            new Meeting
            {
                Id              = EmergencyBugId,
                Title           = "Emergency Bug Meeting",
                Date            = new DateTime(2026, 6, 18, 11, 0, 0, DateTimeKind.Utc),
                DurationMinutes = 180,
                Summary         = "Analisi critica del bug in produzione su modulo pagamenti.",
                WasteScore      = 90,
                WasteReason     = "Meeting non strutturato, tre ore per decidere un rollback.",
                IsAlert         = true
            },
            new Meeting
            {
                Id              = Q3PlanningId,
                Title           = "Q3 Planning",
                Date            = new DateTime(2026, 7, 1, 10, 0, 0, DateTimeKind.Utc),
                DurationMinutes = 120,
                Summary         = "Pianificazione obiettivi e roadmap per il terzo trimestre.",
                WasteScore      = 75,
                WasteReason     = "Agenda poco chiara, rischio di derive fuori tema.",
                IsAlert         = true
            },
            new Meeting
            {
                Id              = TeamSyncId,
                Title           = "Team Sync",
                Date            = new DateTime(2026, 6, 25, 9, 0, 0, DateTimeKind.Utc),
                DurationMinutes = 45,
                Summary         = "Allineamento settimanale sui task in corso e blocchi.",
                WasteScore      = 20,
                WasteReason     = "Sync rapido ed efficace.",
                IsAlert         = false
            }
        );
    }

    private static void SeedParticipants(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MeetingParticipant>().HasData(
            new MeetingParticipant { MeetingId = SprintPlanningId, UserId = ManagerId },
            new MeetingParticipant { MeetingId = SprintPlanningId, UserId = SeniorDevId },
            new MeetingParticipant { MeetingId = SprintPlanningId, UserId = JuniorDevId },

            new MeetingParticipant { MeetingId = DailyStandupId, UserId = ManagerId },
            new MeetingParticipant { MeetingId = DailyStandupId, UserId = SeniorDevId },
            new MeetingParticipant { MeetingId = DailyStandupId, UserId = JuniorDevId },

            new MeetingParticipant { MeetingId = ArchReviewId, UserId = ManagerId },
            new MeetingParticipant { MeetingId = ArchReviewId, UserId = SeniorDevId },

            new MeetingParticipant { MeetingId = TeamRetroId, UserId = ManagerId },
            new MeetingParticipant { MeetingId = TeamRetroId, UserId = SeniorDevId },
            new MeetingParticipant { MeetingId = TeamRetroId, UserId = JuniorDevId },

            new MeetingParticipant { MeetingId = EmergencyBugId, UserId = ManagerId },
            new MeetingParticipant { MeetingId = EmergencyBugId, UserId = SeniorDevId },
            new MeetingParticipant { MeetingId = EmergencyBugId, UserId = JuniorDevId },

            new MeetingParticipant { MeetingId = Q3PlanningId, UserId = ManagerId },
            new MeetingParticipant { MeetingId = Q3PlanningId, UserId = SeniorDevId },
            new MeetingParticipant { MeetingId = Q3PlanningId, UserId = JuniorDevId },

            new MeetingParticipant { MeetingId = TeamSyncId, UserId = ManagerId },
            new MeetingParticipant { MeetingId = TeamSyncId, UserId = SeniorDevId }
        );
    }

    private static void SeedAttachments(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Attachment>().HasData(
            new Attachment
            {
                Id        = new Guid("a0000001-0000-0000-0000-000000000001"),
                MeetingId = SprintPlanningId,
                FileName  = "agenda-sprint.pdf",
                BlobUrl   = "https://fakestorage.blob.core.windows.net/attachments/agenda-sprint.pdf"
            },
            new Attachment
            {
                Id        = new Guid("c0000001-0000-0000-0000-000000000001"),
                MeetingId = ArchReviewId,
                FileName  = "arch-diagram.pdf",
                BlobUrl   = "https://fakestorage.blob.core.windows.net/attachments/arch-diagram.pdf"
            },
            new Attachment
            {
                Id        = new Guid("c0000001-0000-0000-0000-000000000002"),
                MeetingId = ArchReviewId,
                FileName  = "notes.docx",
                BlobUrl   = "https://fakestorage.blob.core.windows.net/attachments/notes.docx"
            },
            new Attachment
            {
                Id        = new Guid("e0000001-0000-0000-0000-000000000001"),
                MeetingId = EmergencyBugId,
                FileName  = "bug-report.pdf",
                BlobUrl   = "https://fakestorage.blob.core.windows.net/attachments/bug-report.pdf"
            },
            new Attachment
            {
                Id        = new Guid("f0000001-0000-0000-0000-000000000001"),
                MeetingId = Q3PlanningId,
                FileName  = "q3-agenda.pdf",
                BlobUrl   = "https://fakestorage.blob.core.windows.net/attachments/q3-agenda.pdf"
            }
        );
    }
}
