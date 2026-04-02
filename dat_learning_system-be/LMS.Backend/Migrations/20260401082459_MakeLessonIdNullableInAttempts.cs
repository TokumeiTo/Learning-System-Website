using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class MakeLessonIdNullableInAttempts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "LessonId",
                table: "LessonAttempts",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ec843197-c592-430a-ab6b-f307480dec2e", "AQAAAAIAAYagAAAAEHYeVzIrC36u/U2TbYsghQB4GlQ7VTu4jZTLGDgpN4DB6fYHdUZKTQAotIl1YKob/g==", "addb8153-114c-47fc-bd25-3458ad1013a7" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "LessonId",
                table: "LessonAttempts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "d78674e0-62c5-45e4-a298-6949a84b6721", "AQAAAAIAAYagAAAAEGBadZVX6PEBtdVPjYIgikh8S74NJq3i4XB+iI8wOg4E85Dxy9eILEQSWeSBqVpmkg==", "7c862f67-9e74-4fbd-be40-9ba5f0cbfceb" });
        }
    }
}
