using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLessonContentFilterAndRESTART : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2dc9fe86-a5c4-45bf-a240-bde9d28fdff3", "AQAAAAIAAYagAAAAEEtsGCvZ1EeQ5UGFfbviZfN2gd5qVjwwsWHldcnGtNkbe/Z8iHtXnJC9f5rc7tw1ZA==", "0dcbca22-ee0a-4aae-8e71-f5b52e0bfd27" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "cd098b55-c020-47f1-b70e-203a1b29c474", "AQAAAAIAAYagAAAAEHXgFg9nQUaJAgafOBxtXiSAx/N2wvjOOxlasG8ZC1ixWynNWZ8KvKVcrntYWipItw==", "53f738f7-0681-42ff-8c69-87d6254844ab" });
        }
    }
}
