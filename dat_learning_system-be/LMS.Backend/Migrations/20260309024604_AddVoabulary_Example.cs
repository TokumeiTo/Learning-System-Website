using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddVoabulary_Example : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Vocabularies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Word = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Reading = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Meaning = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    PartOfSpeech = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    JLPTLevel = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Explanation = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vocabularies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VocabularyExamples",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Japanese = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    English = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    VocabularyId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VocabularyExamples", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VocabularyExamples_Vocabularies_VocabularyId",
                        column: x => x.VocabularyId,
                        principalTable: "Vocabularies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e56303ed-1f17-4336-99ac-2d7ebf948d89", "AQAAAAIAAYagAAAAELfPFwIlj9HdW5fFn5N9AY/Ps7dAQhrAbUfXn2UJg08uymwoiW96Kt8gNfwcIue14A==", "86e64876-8f52-4155-968d-6589e11f7f23" });

            migrationBuilder.CreateIndex(
                name: "IX_VocabularyExamples_VocabularyId",
                table: "VocabularyExamples",
                column: "VocabularyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VocabularyExamples");

            migrationBuilder.DropTable(
                name: "Vocabularies");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1f820c51-ceca-4eba-8d47-9bf827300431", "AQAAAAIAAYagAAAAEHmljNDEBASwE4JI5AjRn9UyfCLtzrUySpmKbsMcODLthHmTL+OPu/4DATGET6Rgyw==", "80285ead-0d5d-4dba-b842-5df080070e17" });
        }
    }
}
