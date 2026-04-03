using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeNameTestAttempt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LessonAttempts");

            migrationBuilder.CreateTable(
                name: "TestAttempts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: true),
                    TestId = table.Column<Guid>(type: "uuid", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    MaxScore = table.Column<int>(type: "integer", nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    IsPassed = table.Column<bool>(type: "boolean", nullable: false),
                    Attempts = table.Column<int>(type: "integer", nullable: false),
                    AnswerJson = table.Column<string>(type: "text", nullable: true),
                    AttemptedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestAttempts_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_TestAttempts_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b6a9ee75-7cd4-4574-9680-64799e12ec6b", "AQAAAAIAAYagAAAAECkTLU2nJJdenhdXk/FN83a2BJWMnk8Ipfu2BP6AJvcxq4BKeCe+6GR7TLHQCOTUnA==", "1e0c3498-7fd0-49cb-8d10-af699e30e524" });

            migrationBuilder.CreateIndex(
                name: "IX_TestAttempts_LessonId",
                table: "TestAttempts",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_TestAttempts_TestId",
                table: "TestAttempts",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Lesson_Audit",
                table: "TestAttempts",
                columns: new[] { "UserId", "LessonId", "AttemptedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_User_Quiz_Completion",
                table: "TestAttempts",
                columns: new[] { "UserId", "TestId", "IsPassed" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TestAttempts");

            migrationBuilder.CreateTable(
                name: "LessonAttempts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: true),
                    TestId = table.Column<Guid>(type: "uuid", nullable: false),
                    AnswerJson = table.Column<string>(type: "text", nullable: true),
                    AttemptedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Attempts = table.Column<int>(type: "integer", nullable: false),
                    IsPassed = table.Column<bool>(type: "boolean", nullable: false),
                    MaxScore = table.Column<int>(type: "integer", nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LessonAttempts_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LessonAttempts_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "41c9bb87-f82d-427c-b102-b604077218de", "AQAAAAIAAYagAAAAEAs4yaZoOhTcV5Pq8GLwc4/HhU+dz8yHt2Oc5w+pU2hFxxrbonv9e49MxrBBrfiAtw==", "6dd691d8-738d-44b8-97a3-5e5ba54c1335" });

            migrationBuilder.CreateIndex(
                name: "IX_LessonAttempts_LessonId",
                table: "LessonAttempts",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonAttempts_TestId",
                table: "LessonAttempts",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Lesson_Audit",
                table: "LessonAttempts",
                columns: new[] { "UserId", "LessonId", "AttemptedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_User_Quiz_Completion",
                table: "LessonAttempts",
                columns: new[] { "UserId", "TestId", "IsPassed" });
        }
    }
}
