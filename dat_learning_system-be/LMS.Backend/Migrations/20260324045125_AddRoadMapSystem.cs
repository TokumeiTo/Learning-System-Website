using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRoadMapSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RoadMap",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    TargetRole = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ThumbnailUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoadMap", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoadmapStep",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoadMapId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    NodeType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Instruction"),
                    Content = table.Column<string>(type: "text", nullable: true),
                    LinkedResourceId = table.Column<int>(type: "integer", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoadmapStep", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoadmapStep_EBooks_LinkedResourceId",
                        column: x => x.LinkedResourceId,
                        principalTable: "EBooks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_RoadmapStep_RoadMap_RoadMapId",
                        column: x => x.RoadMapId,
                        principalTable: "RoadMap",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "57bc0955-052f-4ff2-9de7-2fff71d27c15", "AQAAAAIAAYagAAAAEOUbc3+EctECkH5aZoHPM9ckx7+i3ORZnc1AmfhdWz2AFtBEGyRgUGmPxr0b/gtniA==", "0f9623ae-ffc3-43f1-a110-a6fe2eea1c9c" });

            migrationBuilder.CreateIndex(
                name: "IX_RoadMap_CreatedAt",
                table: "RoadMap",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_RoadmapStep_LinkedResourceId",
                table: "RoadmapStep",
                column: "LinkedResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_RoadmapStep_RoadMapId_SortOrder",
                table: "RoadmapStep",
                columns: new[] { "RoadMapId", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoadmapStep");

            migrationBuilder.DropTable(
                name: "RoadMap");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5229308b-259f-4190-a44e-0059330e8560", "AQAAAAIAAYagAAAAEOOPtPJlMIVsCUbuqPK8Bw2SCNUebFs/LOqVOSvo9YVVq/nTW3RJvPZUD+NcuYx86A==", "bd51a2bd-23e2-40d9-b72f-f61595823a3f" });
        }
    }
}
