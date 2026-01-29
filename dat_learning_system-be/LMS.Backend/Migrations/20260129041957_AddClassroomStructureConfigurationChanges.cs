using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddClassroomStructureConfigurationChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c9abc920-fa4c-4bdb-a56f-c91bb2aa29f2", "AQAAAAIAAYagAAAAEOkQ9CPYCsfOfpDZqPLpXNduNX4dh/x5oNeEvlCKQxNrS7yQQ30rSNUE4qkYnS7lmQ==", "84db58b7-5da2-41a5-8bba-71c742ffb6a1" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9471d759-a168-47e5-b27a-164d6a89eeca", "AQAAAAIAAYagAAAAEDyODrAmGmejVBNoZTSJQeHbBKgbzYIAB+XZ9payL6tKs8O2ICVkEkSTYMkXfxdZcA==", "3604976c-6f7c-4ea6-8e78-eda7d002c498" });
        }
    }
}
