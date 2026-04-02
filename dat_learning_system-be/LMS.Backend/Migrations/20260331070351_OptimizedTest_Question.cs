using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class OptimizedTest_Question : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MediaUrl",
                table: "Questions",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Questions",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8dea9b26-a50e-418a-9356-0512815ed466", "AQAAAAIAAYagAAAAEJZUCFcvuJO6H6RksGILxYDmV71QJ5ZNHDCLniMdwEMNNRHT0oRntnOOBTK9lU5mdQ==", "f17b00dd-a90c-4e8e-9f6c-c0e6fd2a38b3" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaUrl",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Questions");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4bae09d4-c7ba-4a59-a3ac-c7e9dd21dc94", "AQAAAAIAAYagAAAAEGVdZ3CNQIgF1zGKcL313eSCaNsyay+uTo9pL+eVNVMzZ7QLg+N3JhXyd3N6ABIJtQ==", "2d758632-0bbe-408c-b523-7369434a4dd8" });
        }
    }
}
