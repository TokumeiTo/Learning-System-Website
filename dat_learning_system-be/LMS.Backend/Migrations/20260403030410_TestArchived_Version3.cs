using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class TestArchived_Version3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "41c9bb87-f82d-427c-b102-b604077218de", "AQAAAAIAAYagAAAAEAs4yaZoOhTcV5Pq8GLwc4/HhU+dz8yHt2Oc5w+pU2hFxxrbonv9e49MxrBBrfiAtw==", "6dd691d8-738d-44b8-97a3-5e5ba54c1335" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "793f8372-c5b5-410a-87aa-1508ffe6c50e", "AQAAAAIAAYagAAAAEJecbHMJif0G2gV2NB4nYf8O4rxm3epkaObfNKfjcoxEpTHT99k9dD7D2RALYGZi9A==", "034c2295-a475-4ace-8ebf-ac719190b278" });
        }
    }
}
