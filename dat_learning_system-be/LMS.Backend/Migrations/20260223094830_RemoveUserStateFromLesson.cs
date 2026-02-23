using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserStateFromLesson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Lessons_CourseId",
                table: "Lessons");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_SortOrder",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "IsDone",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "Lessons");

            migrationBuilder.AlterColumn<string>(
                name: "Time",
                table: "Lessons",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fef4fe09-64af-47fc-b796-6679e874c898", "AQAAAAIAAYagAAAAEJNOtvxUEatgJsh5xWpr01cBsg5edRhjJV79wGGQyVz68LTl8IOXMkujtI9krUiyBQ==", "fc04339e-7940-4a40-8897-8b8e89c9de6d" });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_CourseId_SortOrder",
                table: "Lessons",
                columns: new[] { "CourseId", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Lessons_CourseId_SortOrder",
                table: "Lessons");

            migrationBuilder.AlterColumn<string>(
                name: "Time",
                table: "Lessons",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<bool>(
                name: "IsDone",
                table: "Lessons",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "Lessons",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e88f8c02-25db-45ab-a1b6-9a62c8fdb838", "AQAAAAIAAYagAAAAEGrTbrrsdFkUrLf9VxjK/m5nUb0Gr79opRayqqNedrLAFuHLXTBcQMKqKCMXzHzvNA==", "4be002e2-3778-45e1-bf1e-41f6d6eccbc5" });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_CourseId",
                table: "Lessons",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SortOrder",
                table: "Lessons",
                column: "SortOrder");
        }
    }
}
