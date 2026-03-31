using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCourseCascadeAndFilters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4bae09d4-c7ba-4a59-a3ac-c7e9dd21dc94", "AQAAAAIAAYagAAAAEGVdZ3CNQIgF1zGKcL313eSCaNsyay+uTo9pL+eVNVMzZ7QLg+N3JhXyd3N6ABIJtQ==", "2d758632-0bbe-408c-b523-7369434a4dd8" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c07ad472-9a28-47c9-a330-8d2b32072fa4", "AQAAAAIAAYagAAAAEKbGr+kOg45umgRdnNJkZ/yrDQpvnAIPwzK3X/lLtWVAS1z2aa8dJzdBeZMn+Py4Dg==", "22c23923-3441-48f8-a50f-a8f397d7097d" });
        }
    }
}
