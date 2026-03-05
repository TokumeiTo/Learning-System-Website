using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddKanjiTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kanjis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Character = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Meaning = table.Column<string>(type: "text", nullable: false),
                    Romaji = table.Column<string>(type: "text", nullable: true),
                    Strokes = table.Column<int>(type: "integer", nullable: false),
                    JlptLevel = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Onyomi = table.Column<string>(type: "text", nullable: true),
                    Kunyomi = table.Column<string>(type: "text", nullable: true),
                    Radicals = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kanjis", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KanjiExamples",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Word = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Reading = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Meaning = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    KanjiId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KanjiExamples", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KanjiExamples_Kanjis_KanjiId",
                        column: x => x.KanjiId,
                        principalTable: "Kanjis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ae72f764-fcdd-49cc-b4d4-8421aacddf24", "AQAAAAIAAYagAAAAELfwR4uWfZNajRHEff7qgQ+QPCkCOO8QFjyl0+11QorfwDcJPLsA0dC+ysgUi7WSWw==", "8b013396-635a-4f52-8d84-40eef86b64c1" });

            migrationBuilder.CreateIndex(
                name: "IX_KanjiExamples_KanjiId",
                table: "KanjiExamples",
                column: "KanjiId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KanjiExamples");

            migrationBuilder.DropTable(
                name: "Kanjis");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "65ef1c49-a00d-447c-8cf5-a051e06591e6", "AQAAAAIAAYagAAAAEKmqW2KjIhVpq3ESKpeP7nvVjbh7pJbJ/Cp5y7UoEObRrS98OOHwAr5bpkKTkmpLvQ==", "95323a3f-e93e-4108-9be0-de00cddc7f75" });
        }
    }
}
