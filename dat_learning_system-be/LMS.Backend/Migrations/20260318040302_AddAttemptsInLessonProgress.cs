using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAttemptsInLessonProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Attempts",
                table: "LessonAttempts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4ea4292a-8c7f-43aa-8139-193ff1ec0afe", "AQAAAAIAAYagAAAAEENDDrKN7MJRR5ZOe6v8VyXS92S6xHQpzvWAmH0g6dFpM8aqkAIFuB/3AtDx6/dgjQ==", "6b8c3000-c18c-4eb4-bec1-84e212776d40" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attempts",
                table: "LessonAttempts");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3b6888ba-573f-4714-b764-2d08572b19f8", "AQAAAAIAAYagAAAAEIDSJ3YpEGWmb0Iv/ImgnfUKkgiQh/mntar8+5YVBYMNL3TaUJJiedoB8Jd7S91CtQ==", "9ef08012-c7de-4f1b-8090-719a2f3a3fdc" });
        }
    }
}
