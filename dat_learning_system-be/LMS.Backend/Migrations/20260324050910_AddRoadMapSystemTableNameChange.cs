using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRoadMapSystemTableNameChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoadmapStep_EBooks_LinkedResourceId",
                table: "RoadmapStep");

            migrationBuilder.DropForeignKey(
                name: "FK_RoadmapStep_RoadMap_RoadMapId",
                table: "RoadmapStep");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoadmapStep",
                table: "RoadmapStep");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoadMap",
                table: "RoadMap");

            migrationBuilder.RenameTable(
                name: "RoadmapStep",
                newName: "RoadMapSteps");

            migrationBuilder.RenameTable(
                name: "RoadMap",
                newName: "RoadMaps");

            migrationBuilder.RenameIndex(
                name: "IX_RoadmapStep_RoadMapId_SortOrder",
                table: "RoadMapSteps",
                newName: "IX_RoadMapSteps_RoadMapId_SortOrder");

            migrationBuilder.RenameIndex(
                name: "IX_RoadmapStep_LinkedResourceId",
                table: "RoadMapSteps",
                newName: "IX_RoadMapSteps_LinkedResourceId");

            migrationBuilder.RenameIndex(
                name: "IX_RoadMap_CreatedAt",
                table: "RoadMaps",
                newName: "IX_RoadMaps_CreatedAt");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoadMapSteps",
                table: "RoadMapSteps",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoadMaps",
                table: "RoadMaps",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "7dac8993-b44a-4ddd-b57e-f5500df161b9", "AQAAAAIAAYagAAAAENkeuwrYxrHxnbxGwQbiaFSi/QRsypYwjp/svZjiQE5L4aK0vTemJzhxje6gv7y8sg==", "480d0bbc-a3b6-46aa-88c1-6790ff0ff44b" });

            migrationBuilder.AddForeignKey(
                name: "FK_RoadMapSteps_EBooks_LinkedResourceId",
                table: "RoadMapSteps",
                column: "LinkedResourceId",
                principalTable: "EBooks",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_RoadMapSteps_RoadMaps_RoadMapId",
                table: "RoadMapSteps",
                column: "RoadMapId",
                principalTable: "RoadMaps",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoadMapSteps_EBooks_LinkedResourceId",
                table: "RoadMapSteps");

            migrationBuilder.DropForeignKey(
                name: "FK_RoadMapSteps_RoadMaps_RoadMapId",
                table: "RoadMapSteps");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoadMapSteps",
                table: "RoadMapSteps");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoadMaps",
                table: "RoadMaps");

            migrationBuilder.RenameTable(
                name: "RoadMapSteps",
                newName: "RoadmapStep");

            migrationBuilder.RenameTable(
                name: "RoadMaps",
                newName: "RoadMap");

            migrationBuilder.RenameIndex(
                name: "IX_RoadMapSteps_RoadMapId_SortOrder",
                table: "RoadmapStep",
                newName: "IX_RoadmapStep_RoadMapId_SortOrder");

            migrationBuilder.RenameIndex(
                name: "IX_RoadMapSteps_LinkedResourceId",
                table: "RoadmapStep",
                newName: "IX_RoadmapStep_LinkedResourceId");

            migrationBuilder.RenameIndex(
                name: "IX_RoadMaps_CreatedAt",
                table: "RoadMap",
                newName: "IX_RoadMap_CreatedAt");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoadmapStep",
                table: "RoadmapStep",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoadMap",
                table: "RoadMap",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "57bc0955-052f-4ff2-9de7-2fff71d27c15", "AQAAAAIAAYagAAAAEOUbc3+EctECkH5aZoHPM9ckx7+i3ORZnc1AmfhdWz2AFtBEGyRgUGmPxr0b/gtniA==", "0f9623ae-ffc3-43f1-a110-a6fe2eea1c9c" });

            migrationBuilder.AddForeignKey(
                name: "FK_RoadmapStep_EBooks_LinkedResourceId",
                table: "RoadmapStep",
                column: "LinkedResourceId",
                principalTable: "EBooks",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_RoadmapStep_RoadMap_RoadMapId",
                table: "RoadmapStep",
                column: "RoadMapId",
                principalTable: "RoadMap",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
