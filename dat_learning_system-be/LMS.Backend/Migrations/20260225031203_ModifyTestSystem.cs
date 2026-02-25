using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ModifyTestSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PassingGrade",
                table: "Tests",
                type: "integer",
                nullable: false,
                defaultValue: 40);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Tests",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AnswerJson",
                table: "LessonAttempts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LessonContentId",
                table: "LessonAttempts",
                type: "uuid",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "70c7c936-77d1-473a-a4f7-7d3a39d361b3", "AQAAAAIAAYagAAAAELdkP/x9b3AQOI7/RjZ+1Mm/iUH+slltzwARHqUbaVsKJVfKcmVQbYCYBnU3JnZdGQ==", "f9cbe8a8-5514-4366-b7d0-1a2673738ab6" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PassingGrade",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "AnswerJson",
                table: "LessonAttempts");

            migrationBuilder.DropColumn(
                name: "LessonContentId",
                table: "LessonAttempts");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e22d9cca-fc3e-475f-8b3f-66defdf9a1d4", "AQAAAAIAAYagAAAAEGrKLkjTB8dBMYnfbspprozzr+w5/0BW4F8ZHX8IP1bNo1ooV2gtv0ZqeiL9DPJJ1g==", "6b21a2d1-12fb-41cf-8f83-4633867da4bc" });
        }
    }
}
