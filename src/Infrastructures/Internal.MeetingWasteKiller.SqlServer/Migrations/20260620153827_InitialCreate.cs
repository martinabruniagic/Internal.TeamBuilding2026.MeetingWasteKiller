using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Internal.MeetingWasteKiller.SqlServer.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Meetings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WasteScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WasteReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsAlert = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meetings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Attachments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MeetingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BlobUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attachments_Meetings_MeetingId",
                        column: x => x.MeetingId,
                        principalTable: "Meetings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingParticipants",
                columns: table => new
                {
                    MeetingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingParticipants", x => new { x.MeetingId, x.UserId });
                    table.ForeignKey(
                        name: "FK_MeetingParticipants_Meetings_MeetingId",
                        column: x => x.MeetingId,
                        principalTable: "Meetings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingParticipants_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Meetings",
                columns: new[] { "Id", "Date", "DurationMinutes", "IsAlert", "Summary", "Title", "WasteReason", "WasteScore" },
                values: new object[,]
                {
                    { new Guid("00000001-0000-0000-0000-000000000001"), new DateTime(2026, 6, 25, 9, 0, 0, 0, DateTimeKind.Utc), 45, false, "Allineamento settimanale sui task in corso e blocchi.", "Team Sync", "Sync rapido ed efficace.", 20m },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2026, 5, 15, 9, 0, 0, 0, DateTimeKind.Utc), 90, true, "Sprint planning per il Q2. Definizione backlog e stime.", "Sprint Planning", "Troppi partecipanti, durata eccessiva rispetto al valore prodotto.", 80m },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new DateTime(2026, 6, 1, 9, 30, 0, 0, DateTimeKind.Utc), 30, false, "Sincronizzazione quotidiana del team di sviluppo.", "Daily Standup", "Meeting efficiente, breve e focalizzato.", 15m },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), new DateTime(2026, 5, 20, 14, 0, 0, 0, DateTimeKind.Utc), 120, true, "Revisione dell'architettura del sistema di autenticazione.", "Architecture Review", "Discussioni circolari senza decisioni concrete.", 65m },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2026, 6, 10, 15, 0, 0, 0, DateTimeKind.Utc), 60, false, "Retrospettiva di fine sprint: punti positivi e aree di miglioramento.", "Team Retrospective", "Meeting produttivo con azioni concrete identificate.", 30m },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2026, 6, 18, 11, 0, 0, 0, DateTimeKind.Utc), 180, true, "Analisi critica del bug in produzione su modulo pagamenti.", "Emergency Bug Meeting", "Meeting non strutturato, tre ore per decidere un rollback.", 90m },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2026, 7, 1, 10, 0, 0, 0, DateTimeKind.Utc), 120, true, "Pianificazione obiettivi e roadmap per il terzo trimestre.", "Q3 Planning", "Agenda poco chiara, rischio di derive fuori tema.", 75m }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "DailyCost", "Email", "Name", "Role" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), 800m, "martina@company.com", "Mario Rossi", "Manager" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), 600m, "dev@company.com", "Luca Bianchi", "Senior Dev" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), 350m, "junior@company.com", "Sara Verdi", "Junior Dev" }
                });

            migrationBuilder.InsertData(
                table: "Attachments",
                columns: new[] { "Id", "BlobUrl", "FileName", "MeetingId" },
                values: new object[,]
                {
                    { new Guid("a0000001-0000-0000-0000-000000000001"), "https://fakestorage.blob.core.windows.net/attachments/agenda-sprint.pdf", "agenda-sprint.pdf", new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa") },
                    { new Guid("c0000001-0000-0000-0000-000000000001"), "https://fakestorage.blob.core.windows.net/attachments/arch-diagram.pdf", "arch-diagram.pdf", new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc") },
                    { new Guid("c0000001-0000-0000-0000-000000000002"), "https://fakestorage.blob.core.windows.net/attachments/notes.docx", "notes.docx", new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc") },
                    { new Guid("e0000001-0000-0000-0000-000000000001"), "https://fakestorage.blob.core.windows.net/attachments/bug-report.pdf", "bug-report.pdf", new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee") },
                    { new Guid("f0000001-0000-0000-0000-000000000001"), "https://fakestorage.blob.core.windows.net/attachments/q3-agenda.pdf", "q3-agenda.pdf", new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff") }
                });

            migrationBuilder.InsertData(
                table: "MeetingParticipants",
                columns: new[] { "MeetingId", "UserId" },
                values: new object[,]
                {
                    { new Guid("00000001-0000-0000-0000-000000000001"), new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("00000001-0000-0000-0000-000000000001"), new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new Guid("33333333-3333-3333-3333-333333333333") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_MeetingId",
                table: "Attachments",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingParticipants_UserId",
                table: "MeetingParticipants",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachments");

            migrationBuilder.DropTable(
                name: "MeetingParticipants");

            migrationBuilder.DropTable(
                name: "Meetings");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
