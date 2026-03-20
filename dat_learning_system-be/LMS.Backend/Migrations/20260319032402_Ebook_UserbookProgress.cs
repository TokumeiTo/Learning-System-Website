using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class Ebook_UserbookProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EBooks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Author = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    TotalDownloadCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    TotalReaderCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    AverageRating = table.Column<double>(type: "double precision", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EBooks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserBookProgresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    EBookId = table.Column<int>(type: "integer", nullable: false),
                    HasDownloaded = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    HasOpened = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    TotalMinutesSpent = table.Column<double>(type: "double precision", nullable: false, defaultValue: 0.0),
                    LastAccessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBookProgresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBookProgresses_EBooks_EBookId",
                        column: x => x.EBookId,
                        principalTable: "EBooks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4dd96906-233e-4ccd-85ea-6426bfb5067c", "AQAAAAIAAYagAAAAEH67uql/VY6SIii9zoAtVLztGvo2l/kuX5gmd8PRBIqGQyc7XZUFmhRqKkKpif/YQw==", "a309649c-3286-4fe4-b70e-5ebe76d52cc4" });

            migrationBuilder.CreateIndex(
                name: "IX_EBooks_Category",
                table: "EBooks",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_UserBookProgresses_EBookId",
                table: "UserBookProgresses",
                column: "EBookId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBookProgresses_UserId_EBookId",
                table: "UserBookProgresses",
                columns: new[] { "UserId", "EBookId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserBookProgresses");

            migrationBuilder.DropTable(
                name: "EBooks");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4ea4292a-8c7f-43aa-8139-193ff1ec0afe", "AQAAAAIAAYagAAAAEENDDrKN7MJRR5ZOe6v8VyXS92S6xHQpzvWAmH0g6dFpM8aqkAIFuB/3AtDx6/dgjQ==", "6b8c3000-c18c-4eb4-bec1-84e212776d40" });
        }
    }
}
