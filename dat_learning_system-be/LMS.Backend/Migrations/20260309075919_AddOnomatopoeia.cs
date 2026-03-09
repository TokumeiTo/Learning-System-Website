using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddOnomatopoeia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Onomatopoeias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Phrase = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Romaji = table.Column<string>(type: "text", nullable: false),
                    Meaning = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Explanation = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Onomatopoeias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OnomatopoeiaExample",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Japanese = table.Column<string>(type: "text", nullable: false),
                    English = table.Column<string>(type: "text", nullable: false),
                    OnomatopoeiaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnomatopoeiaExample", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OnomatopoeiaExample_Onomatopoeias_OnomatopoeiaId",
                        column: x => x.OnomatopoeiaId,
                        principalTable: "Onomatopoeias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "58a78340-8a12-40f4-8476-ecae949e2a82", "AQAAAAIAAYagAAAAEJSM/CUbNCOpmYM089h8pj1ZIRVI3x6m7LWKQFeudhSmckQoFsd3hSTZFc7MQr7EuQ==", "98033ca6-3e52-4bba-a3a7-bacfba56f0e5" });

            migrationBuilder.CreateIndex(
                name: "IX_OnomatopoeiaExample_OnomatopoeiaId",
                table: "OnomatopoeiaExample",
                column: "OnomatopoeiaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OnomatopoeiaExample");

            migrationBuilder.DropTable(
                name: "Onomatopoeias");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e56303ed-1f17-4336-99ac-2d7ebf948d89", "AQAAAAIAAYagAAAAELfPFwIlj9HdW5fFn5N9AY/Ps7dAQhrAbUfXn2UJg08uymwoiW96Kt8gNfwcIue14A==", "86e64876-8f52-4155-968d-6589e11f7f23" });
        }
    }
}
