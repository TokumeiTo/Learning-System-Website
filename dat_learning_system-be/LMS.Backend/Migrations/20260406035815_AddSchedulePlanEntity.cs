using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSchedulePlanEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SchedulePlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CourseName = table.Column<string>(type: "text", nullable: true),
                    InstructorName = table.Column<string>(type: "text", nullable: true),
                    ActivityType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false, defaultValue: "#6366f1"),
                    IsPublic = table.Column<bool>(type: "boolean", nullable: false),
                    TargetPositions = table.Column<string>(type: "text", nullable: true),
                    TargetUserCodes = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchedulePlans", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ada260e8-6f9c-45ed-a351-d82793038e06", "AQAAAAIAAYagAAAAEMjTnPe94GbFgFiNF88drsyfcZXiipE5mrRdUekwVnOt5IydE8XoXVU+eLfLC1YcuA==", "d1bbc2c8-7674-4ce1-9728-430ab093c9c1" });

            migrationBuilder.CreateIndex(
                name: "IX_SchedulePlans_IsPublic",
                table: "SchedulePlans",
                column: "IsPublic");

            migrationBuilder.CreateIndex(
                name: "IX_SchedulePlans_StartTime",
                table: "SchedulePlans",
                column: "StartTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SchedulePlans");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b6a9ee75-7cd4-4574-9680-64799e12ec6b", "AQAAAAIAAYagAAAAECkTLU2nJJdenhdXk/FN83a2BJWMnk8Ipfu2BP6AJvcxq4BKeCe+6GR7TLHQCOTUnA==", "1e0c3498-7fd0-49cb-8d10-af699e30e524" });
        }
    }
}
