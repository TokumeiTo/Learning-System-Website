using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLessonTestVersioning : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonAttempts_Tests_TestId",
                table: "LessonAttempts");

            migrationBuilder.DropIndex(
                name: "IX_Tests_LessonContentId",
                table: "Tests");

            migrationBuilder.DropIndex(
                name: "IX_LessonAttempts_UserId_TestId_AttemptedAt",
                table: "LessonAttempts");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Tests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "f5338e7d-186e-48e2-8d8d-1aa9f471a03e", "AQAAAAIAAYagAAAAEAiLgHtA4JA2aR354xbLRFnMod8tK38/ShhKnLGtZxha7rz4T3NhJ3XSxvfviKbF8A==", "eb3378fa-8553-4031-8a7a-707bbf22a4bc" });

            migrationBuilder.CreateIndex(
                name: "IX_Tests_LessonContentId",
                table: "Tests",
                column: "LessonContentId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Lesson_Performance",
                table: "LessonAttempts",
                columns: new[] { "UserId", "LessonId", "AttemptedAt", "Percentage" });

            migrationBuilder.AddForeignKey(
                name: "FK_LessonAttempts_Tests_TestId",
                table: "LessonAttempts",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonAttempts_Tests_TestId",
                table: "LessonAttempts");

            migrationBuilder.DropIndex(
                name: "IX_Tests_LessonContentId",
                table: "Tests");

            migrationBuilder.DropIndex(
                name: "IX_User_Lesson_Performance",
                table: "LessonAttempts");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Tests");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "01ae9dbc-4a43-4fac-a48d-3233ce40593a", "AQAAAAIAAYagAAAAEBqkp/R2dGCddSDiNsj3FGxPlbhiWwiDCGcYO3kxhDRPF0UgL/bwbOKTnL8DlggdBQ==", "a7bc467d-4809-4e26-87b8-8374e977d925" });

            migrationBuilder.CreateIndex(
                name: "IX_Tests_LessonContentId",
                table: "Tests",
                column: "LessonContentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LessonAttempts_UserId_TestId_AttemptedAt",
                table: "LessonAttempts",
                columns: new[] { "UserId", "TestId", "AttemptedAt" });

            migrationBuilder.AddForeignKey(
                name: "FK_LessonAttempts_Tests_TestId",
                table: "LessonAttempts",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id");
        }
    }
}
