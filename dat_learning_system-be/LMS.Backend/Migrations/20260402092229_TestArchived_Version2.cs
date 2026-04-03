using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class TestArchived_Version2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Tests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Questions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "793f8372-c5b5-410a-87aa-1508ffe6c50e", "AQAAAAIAAYagAAAAEJecbHMJif0G2gV2NB4nYf8O4rxm3epkaObfNKfjcoxEpTHT99k9dD7D2RALYGZi9A==", "034c2295-a475-4ace-8ebf-ac719190b278" });

            migrationBuilder.CreateIndex(
                name: "IX_Tests_Title_Version_IsGlobal",
                table: "Tests",
                columns: new[] { "Title", "Version", "IsGlobal" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tests_Title_Version_IsGlobal",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Questions");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3b7319c2-1c91-4cd9-ab03-7c409c6b0166", "AQAAAAIAAYagAAAAEJT3wAJ572IWfBxKrY5h43yFbzh8l1971Pi0AITP5Zq8rt/lDNnRa9/wIlXlEcH1iA==", "10a10baa-3973-4246-adb8-6f5f9ff3c782" });
        }
    }
}
