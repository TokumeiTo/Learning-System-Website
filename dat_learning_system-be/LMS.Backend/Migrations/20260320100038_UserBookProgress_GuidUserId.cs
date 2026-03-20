using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UserBookProgress_GuidUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "UserBookProgresses",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "87fab527-e018-4f54-ab44-897fb16eb87b", "AQAAAAIAAYagAAAAECXBW9R0HLGuYIk1sAwBFFf8rSaRbt0uWtiDiGFgzKYesbvuyQ7o0yCEvC0Gc8zxXw==", "4662f606-ffff-4b0a-9036-099920d9c11f" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserBookProgresses",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3c3659e3-dbb4-4860-a706-c2fb79d75c05", "AQAAAAIAAYagAAAAEFtfHvf7wh45LvYQq+RpJERg5h+rQrEaktrCulcdDKdX18ECo716KxpjFhYTbXDlog==", "3931fee7-1cd1-42f2-a9c2-07c1201ed1c8" });
        }
    }
}
