using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddOnomatopoeia2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Japanese",
                table: "OnomatopoeiaExample",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "English",
                table: "OnomatopoeiaExample",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "55d55f0f-d861-4008-929f-2c02dc3e2d0a", "AQAAAAIAAYagAAAAEDuQPK4kStyktvtUg6+Eui7hTbizr8OU4oPHNgIhmo9+88EvxZw78YfRsD8zFVg7WQ==", "712b870b-8d7c-4f13-af58-ba714c48381c" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Japanese",
                table: "OnomatopoeiaExample",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<string>(
                name: "English",
                table: "OnomatopoeiaExample",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "58a78340-8a12-40f4-8476-ecae949e2a82", "AQAAAAIAAYagAAAAEJSM/CUbNCOpmYM089h8pj1ZIRVI3x6m7LWKQFeudhSmckQoFsd3hSTZFc7MQr7EuQ==", "98033ca6-3e52-4bba-a3a7-bacfba56f0e5" });
        }
    }
}
