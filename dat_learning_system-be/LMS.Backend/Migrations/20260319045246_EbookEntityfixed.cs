using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class EbookEntityfixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "EBooks",
                newName: "ThumbnailUrl");

            migrationBuilder.AlterColumn<double>(
                name: "AverageRating",
                table: "EBooks",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "EBooks",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "EBooks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3c3659e3-dbb4-4860-a706-c2fb79d75c05", "AQAAAAIAAYagAAAAEFtfHvf7wh45LvYQq+RpJERg5h+rQrEaktrCulcdDKdX18ECo716KxpjFhYTbXDlog==", "3931fee7-1cd1-42f2-a9c2-07c1201ed1c8" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "EBooks");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "EBooks");

            migrationBuilder.RenameColumn(
                name: "ThumbnailUrl",
                table: "EBooks",
                newName: "ImageUrl");

            migrationBuilder.AlterColumn<double>(
                name: "AverageRating",
                table: "EBooks",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldDefaultValue: 0.0);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4dd96906-233e-4ccd-85ea-6426bfb5067c", "AQAAAAIAAYagAAAAEH67uql/VY6SIii9zoAtVLztGvo2l/kuX5gmd8PRBIqGQyc7XZUFmhRqKkKpif/YQw==", "a309649c-3286-4fe4-b70e-5ebe76d52cc4" });
        }
    }
}
