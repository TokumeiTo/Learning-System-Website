using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class IsGlobalInsideTest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsGlobal",
                table: "Tests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "d78674e0-62c5-45e4-a298-6949a84b6721", "AQAAAAIAAYagAAAAEGBadZVX6PEBtdVPjYIgikh8S74NJq3i4XB+iI8wOg4E85Dxy9eILEQSWeSBqVpmkg==", "7c862f67-9e74-4fbd-be40-9ba5f0cbfceb" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsGlobal",
                table: "Tests");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3fee92a6-358a-4d76-ab38-692d45c9a80b", "AQAAAAIAAYagAAAAEAUpbqJ21z/aSBYo2L1pTZJqzeGdsOXJKHzVqujeg7wc2xl/v9u+lGf32autpwy/3g==", "705a0d45-11ed-4ebc-9741-b1a67c2b7daf" });
        }
    }
}
