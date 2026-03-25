using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RoadMapRemoveThumbnailUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "RoadMaps");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "51582f5e-2aca-422d-837a-c4bcde3edfaa", "AQAAAAIAAYagAAAAENbteKMkx+RZp8axjk0bBBVxCq3OjRPoFXjF+3QL7e/vR64M/o//w+Pj73p+3Ggncw==", "a9538678-6c16-44ab-a13e-1967d987315d" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "RoadMaps",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a42846b7-3544-449a-8506-70435614769b", "AQAAAAIAAYagAAAAEMPwWmCA5s+wSPtS9/Eh1iYfRmssdM9d0m4+4OgfrdW8sq4PP/cwIWsL7pzT8W9atA==", "d1999049-2049-404d-b245-308cec6e7405" });
        }
    }
}
