using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ModifyTestSystem2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Questions_TestId",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_LessonContents_LessonId",
                table: "LessonContents");

            migrationBuilder.DropIndex(
                name: "IX_LessonContents_SortOrder",
                table: "LessonContents");

            migrationBuilder.DropIndex(
                name: "IX_LessonAttempts_UserId_LessonId",
                table: "LessonAttempts");

            migrationBuilder.DropColumn(
                name: "PassingScore",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "LessonContentId",
                table: "LessonAttempts");

            migrationBuilder.AddColumn<Guid>(
                name: "TestId",
                table: "LessonAttempts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "01ae9dbc-4a43-4fac-a48d-3233ce40593a", "AQAAAAIAAYagAAAAEBqkp/R2dGCddSDiNsj3FGxPlbhiWwiDCGcYO3kxhDRPF0UgL/bwbOKTnL8DlggdBQ==", "a7bc467d-4809-4e26-87b8-8374e977d925" });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_TestId_SortOrder",
                table: "Questions",
                columns: new[] { "TestId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_LessonContents_LessonId_SortOrder",
                table: "LessonContents",
                columns: new[] { "LessonId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_LessonAttempts_TestId",
                table: "LessonAttempts",
                column: "TestId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonAttempts_Tests_TestId",
                table: "LessonAttempts");

            migrationBuilder.DropIndex(
                name: "IX_Questions_TestId_SortOrder",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_LessonContents_LessonId_SortOrder",
                table: "LessonContents");

            migrationBuilder.DropIndex(
                name: "IX_LessonAttempts_TestId",
                table: "LessonAttempts");

            migrationBuilder.DropIndex(
                name: "IX_LessonAttempts_UserId_TestId_AttemptedAt",
                table: "LessonAttempts");

            migrationBuilder.DropColumn(
                name: "TestId",
                table: "LessonAttempts");

            migrationBuilder.AddColumn<int>(
                name: "PassingScore",
                table: "Lessons",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "LessonContentId",
                table: "LessonAttempts",
                type: "uuid",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "70c7c936-77d1-473a-a4f7-7d3a39d361b3", "AQAAAAIAAYagAAAAELdkP/x9b3AQOI7/RjZ+1Mm/iUH+slltzwARHqUbaVsKJVfKcmVQbYCYBnU3JnZdGQ==", "f9cbe8a8-5514-4366-b7d0-1a2673738ab6" });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_TestId",
                table: "Questions",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonContents_LessonId",
                table: "LessonContents",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonContents_SortOrder",
                table: "LessonContents",
                column: "SortOrder");

            migrationBuilder.CreateIndex(
                name: "IX_LessonAttempts_UserId_LessonId",
                table: "LessonAttempts",
                columns: new[] { "UserId", "LessonId" });
        }
    }
}
