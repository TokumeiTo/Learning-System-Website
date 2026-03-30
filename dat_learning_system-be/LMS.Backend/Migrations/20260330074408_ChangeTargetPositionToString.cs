using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTargetPositionToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TargetPosition",
                table: "Announcements",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c07ad472-9a28-47c9-a330-8d2b32072fa4", "AQAAAAIAAYagAAAAEKbGr+kOg45umgRdnNJkZ/yrDQpvnAIPwzK3X/lLtWVAS1z2aa8dJzdBeZMn+Py4Dg==", "22c23923-3441-48f8-a50f-a8f397d7097d" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TargetPosition",
                table: "Announcements",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "51582f5e-2aca-422d-837a-c4bcde3edfaa", "AQAAAAIAAYagAAAAENbteKMkx+RZp8axjk0bBBVxCq3OjRPoFXjF+3QL7e/vR64M/o//w+Pj73p+3Ggncw==", "a9538678-6c16-44ab-a13e-1967d987315d" });
        }
    }
}
