using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RoadMapLinkedResourceIdFlexible : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoadMapSteps_EBooks_LinkedResourceId",
                table: "RoadMapSteps");

            migrationBuilder.DropIndex(
                name: "IX_RoadMapSteps_LinkedResourceId",
                table: "RoadMapSteps");

            migrationBuilder.AlterColumn<string>(
                name: "LinkedResourceId",
                table: "RoadMapSteps",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a42846b7-3544-449a-8506-70435614769b", "AQAAAAIAAYagAAAAEMPwWmCA5s+wSPtS9/Eh1iYfRmssdM9d0m4+4OgfrdW8sq4PP/cwIWsL7pzT8W9atA==", "d1999049-2049-404d-b245-308cec6e7405" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "LinkedResourceId",
                table: "RoadMapSteps",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "7dac8993-b44a-4ddd-b57e-f5500df161b9", "AQAAAAIAAYagAAAAENkeuwrYxrHxnbxGwQbiaFSi/QRsypYwjp/svZjiQE5L4aK0vTemJzhxje6gv7y8sg==", "480d0bbc-a3b6-46aa-88c1-6790ff0ff44b" });

            migrationBuilder.CreateIndex(
                name: "IX_RoadMapSteps_LinkedResourceId",
                table: "RoadMapSteps",
                column: "LinkedResourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_RoadMapSteps_EBooks_LinkedResourceId",
                table: "RoadMapSteps",
                column: "LinkedResourceId",
                principalTable: "EBooks",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
