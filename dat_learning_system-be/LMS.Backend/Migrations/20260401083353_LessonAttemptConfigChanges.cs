using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class LessonAttemptConfigChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_User_Lesson_Performance",
                table: "LessonAttempts");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3b7319c2-1c91-4cd9-ab03-7c409c6b0166", "AQAAAAIAAYagAAAAEJT3wAJ572IWfBxKrY5h43yFbzh8l1971Pi0AITP5Zq8rt/lDNnRa9/wIlXlEcH1iA==", "10a10baa-3973-4246-adb8-6f5f9ff3c782" });

            migrationBuilder.CreateIndex(
                name: "IX_User_Lesson_Audit",
                table: "LessonAttempts",
                columns: new[] { "UserId", "LessonId", "AttemptedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_User_Quiz_Completion",
                table: "LessonAttempts",
                columns: new[] { "UserId", "TestId", "IsPassed" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_User_Lesson_Audit",
                table: "LessonAttempts");

            migrationBuilder.DropIndex(
                name: "IX_User_Quiz_Completion",
                table: "LessonAttempts");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ec843197-c592-430a-ab6b-f307480dec2e", "AQAAAAIAAYagAAAAEHYeVzIrC36u/U2TbYsghQB4GlQ7VTu4jZTLGDgpN4DB6fYHdUZKTQAotIl1YKob/g==", "addb8153-114c-47fc-bd25-3458ad1013a7" });

            migrationBuilder.CreateIndex(
                name: "IX_User_Lesson_Performance",
                table: "LessonAttempts",
                columns: new[] { "UserId", "LessonId", "AttemptedAt", "Percentage" });
        }
    }
}
