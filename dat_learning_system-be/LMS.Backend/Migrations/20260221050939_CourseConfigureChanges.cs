using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class CourseConfigureChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Badge",
                table: "Courses",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "f351c076-fe53-4989-86a0-4f750a504f0b", "AQAAAAIAAYagAAAAEAaZcGa4C3qVLy7v8NDvY/mE7rJkFOCTKDmcwHeuf4zM4oEEM6SYYzYHi2lMrnSb2A==", "dc69833b-a96e-4432-a80c-8a2c925961eb" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Badge",
                table: "Courses",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2dc9fe86-a5c4-45bf-a240-bde9d28fdff3", "AQAAAAIAAYagAAAAEEtsGCvZ1EeQ5UGFfbviZfN2gd5qVjwwsWHldcnGtNkbe/Z8iHtXnJC9f5rc7tw1ZA==", "0dcbca22-ee0a-4aae-8e71-f5b52e0bfd27" });
        }
    }
}
