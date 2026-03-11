using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTestToUnifiedQuizEngine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizSessions_QuizTemplates_QuizTemplateId",
                table: "QuizSessions");

            migrationBuilder.DropTable(
                name: "QuizTemplates");

            migrationBuilder.DropIndex(
                name: "IX_QuizSessions_QuizTemplateId",
                table: "QuizSessions");

            migrationBuilder.DropIndex(
                name: "IX_QuizSessionAnswers_SourceId",
                table: "QuizSessionAnswers");

            migrationBuilder.DropColumn(
                name: "QuizTemplateId",
                table: "QuizSessions");

            migrationBuilder.DropColumn(
                name: "SourceId",
                table: "QuizSessionAnswers");

            migrationBuilder.AlterColumn<Guid>(
                name: "LessonContentId",
                table: "Tests",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Tests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JlptLevel",
                table: "Tests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TestId",
                table: "QuizSessions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "QuizItemId",
                table: "QuizSessionAnswers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "QuizItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TestId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DisplayMode = table.Column<string>(type: "text", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    Points = table.Column<int>(type: "integer", nullable: false),
                    CustomPrompt = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizItems_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c3515c98-1723-4081-a437-41c611659d25", "AQAAAAIAAYagAAAAECM955yrzNKZJ8Mww1SS559QUlcQbfKjRXriuv5wOhkmCNw4jZe9V12f2H3c2ij8xw==", "f5e6e3db-faa7-4a18-9f48-6c06786181e6" });

            migrationBuilder.CreateIndex(
                name: "IX_QuizSessions_TestId",
                table: "QuizSessions",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizSessionAnswers_QuizItemId",
                table: "QuizSessionAnswers",
                column: "QuizItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizItems_TestId",
                table: "QuizItems",
                column: "TestId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizSessionAnswers_QuizItems_QuizItemId",
                table: "QuizSessionAnswers",
                column: "QuizItemId",
                principalTable: "QuizItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuizSessions_Tests_TestId",
                table: "QuizSessions",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizSessionAnswers_QuizItems_QuizItemId",
                table: "QuizSessionAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_QuizSessions_Tests_TestId",
                table: "QuizSessions");

            migrationBuilder.DropTable(
                name: "QuizItems");

            migrationBuilder.DropIndex(
                name: "IX_QuizSessions_TestId",
                table: "QuizSessions");

            migrationBuilder.DropIndex(
                name: "IX_QuizSessionAnswers_QuizItemId",
                table: "QuizSessionAnswers");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "JlptLevel",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "TestId",
                table: "QuizSessions");

            migrationBuilder.DropColumn(
                name: "QuizItemId",
                table: "QuizSessionAnswers");

            migrationBuilder.AlterColumn<Guid>(
                name: "LessonContentId",
                table: "Tests",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuizTemplateId",
                table: "QuizSessions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SourceId",
                table: "QuizSessionAnswers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "QuizTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Level = table.Column<string>(type: "text", nullable: false),
                    PassScorePercentage = table.Column<int>(type: "integer", nullable: false),
                    QuestionCount = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<string>(type: "text", nullable: false),
                    TimeLimitSeconds = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizTemplates", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b257d9b5-7f10-450a-9dac-261e90f5c228", "AQAAAAIAAYagAAAAEBW3Cisv/DzE6X5Ok0NBp2+pSd2blLyqDV5DHM7dRlWOjfkbyjxuLCdy+Iub4q55kg==", "6f2269f6-a639-4f8f-88b9-0f8377d485f6" });

            migrationBuilder.CreateIndex(
                name: "IX_QuizSessions_QuizTemplateId",
                table: "QuizSessions",
                column: "QuizTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizSessionAnswers_SourceId",
                table: "QuizSessionAnswers",
                column: "SourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizSessions_QuizTemplates_QuizTemplateId",
                table: "QuizSessions",
                column: "QuizTemplateId",
                principalTable: "QuizTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
