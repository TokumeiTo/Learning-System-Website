using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixTopicCourseRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "912ae83d-5ad7-4057-bf4e-25042a8b382a", "AQAAAAIAAYagAAAAEH3vQy2GBWspXMCyqQylKVHmmx5hX46YP2rZ6jd2P6q33xbTBvrRlQOM4OoPsmitEQ==", "b51a563c-982f-4f1a-9d67-266248d33f60" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c9abc920-fa4c-4bdb-a56f-c91bb2aa29f2", "AQAAAAIAAYagAAAAEOkQ9CPYCsfOfpDZqPLpXNduNX4dh/x5oNeEvlCKQxNrS7yQQ30rSNUE4qkYnS7lmQ==", "84db58b7-5da2-41a5-8bba-71c742ffb6a1" });
        }
    }
}
