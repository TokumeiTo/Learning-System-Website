using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddGrammarFlashcard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Grammars",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    JlptLevel = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Meaning = table.Column<string>(type: "text", nullable: false),
                    Structure = table.Column<string>(type: "text", nullable: false),
                    Explanation = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grammars", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GrammarExamples",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Jp = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Romaji = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    En = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    GrammarId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrammarExamples", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GrammarExamples_Grammars_GrammarId",
                        column: x => x.GrammarId,
                        principalTable: "Grammars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1f820c51-ceca-4eba-8d47-9bf827300431", "AQAAAAIAAYagAAAAEHmljNDEBASwE4JI5AjRn9UyfCLtzrUySpmKbsMcODLthHmTL+OPu/4DATGET6Rgyw==", "80285ead-0d5d-4dba-b842-5df080070e17" });

            migrationBuilder.CreateIndex(
                name: "IX_GrammarExamples_GrammarId",
                table: "GrammarExamples",
                column: "GrammarId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GrammarExamples");

            migrationBuilder.DropTable(
                name: "Grammars");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ae72f764-fcdd-49cc-b4d4-8421aacddf24", "AQAAAAIAAYagAAAAELfwR4uWfZNajRHEff7qgQ+QPCkCOO8QFjyl0+11QorfwDcJPLsA0dC+ysgUi7WSWw==", "8b013396-635a-4f52-8d84-40eef86b64c1" });
        }
    }
}
