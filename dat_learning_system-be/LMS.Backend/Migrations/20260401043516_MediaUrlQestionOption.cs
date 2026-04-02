using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class MediaUrlQestionOption : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MediaUrl",
                table: "QuestionOptions",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3fee92a6-358a-4d76-ab38-692d45c9a80b", "AQAAAAIAAYagAAAAEAUpbqJ21z/aSBYo2L1pTZJqzeGdsOXJKHzVqujeg7wc2xl/v9u+lGf32autpwy/3g==", "705a0d45-11ed-4ebc-9741-b1a67c2b7daf" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaUrl",
                table: "QuestionOptions");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8dea9b26-a50e-418a-9356-0512815ed466", "AQAAAAIAAYagAAAAEJZUCFcvuJO6H6RksGILxYDmV71QJ5ZNHDCLniMdwEMNNRHT0oRntnOOBTK9lU5mdQ==", "f17b00dd-a90c-4e8e-9f6c-c0e6fd2a38b3" });
        }
    }
}
