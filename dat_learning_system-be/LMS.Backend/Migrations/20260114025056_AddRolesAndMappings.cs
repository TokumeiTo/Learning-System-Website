using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRolesAndMappings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2e27917d-89e3-4360-9ae1-d7dd4fb24c6f", "AQAAAAIAAYagAAAAEDtFZxzVwnN6ze6qtfZ3ISX3vnw98U8HRAXAJb/ietDPGU8bOL58uqGB5xUPd9WHlg==", "beef4b77-c01b-4448-9c62-322433e05c17" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "cbb47db8-cfdb-423c-b649-667da2a71c26", "AQAAAAIAAYagAAAAEEeSiALhu75ajzZgxSzgyzLw33nzWfgHmbTGf6+/R6R5rcR7kTV6xpuRtJiBB7GX1w==", "1bf58182-3c82-4bf7-9e9c-b9fd02b8815e" });
        }
    }
}
