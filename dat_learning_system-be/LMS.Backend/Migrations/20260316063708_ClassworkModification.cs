using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ClassworkModification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Submissions");

            migrationBuilder.DropTable(
                name: "Assignments");

            migrationBuilder.DropTable(
                name: "Topics");

            migrationBuilder.CreateTable(
                name: "ClassworkTopics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassworkTopics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassworkTopics_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassworkItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TopicId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ItemType = table.Column<string>(type: "text", nullable: false, defaultValue: "Resource"),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    MaxPoints = table.Column<double>(type: "double precision", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassworkItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassworkItems_ClassworkTopics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "ClassworkTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassworkResources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassworkItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResourceUrl = table.Column<string>(type: "text", nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ResourceType = table.Column<string>(type: "text", nullable: false, defaultValue: "File"),
                    UploadedBy = table.Column<string>(type: "text", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassworkResources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassworkResources_ClassworkItems_ClassworkItemId",
                        column: x => x.ClassworkItemId,
                        principalTable: "ClassworkItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassworkSubmissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassworkItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    FileUrl = table.Column<string>(type: "text", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Grade = table.Column<double>(type: "double precision", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassworkSubmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassworkSubmissions_ClassworkItems_ClassworkItemId",
                        column: x => x.ClassworkItemId,
                        principalTable: "ClassworkItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ae3f016a-c03d-406a-9d93-c20d6c91a51d", "AQAAAAIAAYagAAAAEAOKlkl6XdzISxzS0x1sxq/OFqEDTmYCk/JR6e+aTI6Sa2uqqdBTi03VBPRKxo+isQ==", "58418b25-0fc7-4921-b244-744a8a513093" });

            migrationBuilder.CreateIndex(
                name: "IX_ClassworkItems_CreatedAt",
                table: "ClassworkItems",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ClassworkItems_TopicId",
                table: "ClassworkItems",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassworkResources_ClassworkItemId",
                table: "ClassworkResources",
                column: "ClassworkItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassworkSubmissions_ClassworkItemId",
                table: "ClassworkSubmissions",
                column: "ClassworkItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassworkSubmissions_ClassworkItemId_UserId",
                table: "ClassworkSubmissions",
                columns: new[] { "ClassworkItemId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClassworkSubmissions_UserId",
                table: "ClassworkSubmissions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassworkTopics_CourseId",
                table: "ClassworkTopics",
                column: "CourseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassworkResources");

            migrationBuilder.DropTable(
                name: "ClassworkSubmissions");

            migrationBuilder.DropTable(
                name: "ClassworkItems");

            migrationBuilder.DropTable(
                name: "ClassworkTopics");

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Topics_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Assignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TopicId = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assignments_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Submissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AssignmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<string>(type: "text", nullable: false),
                    ContentText = table.Column<string>(type: "text", nullable: false),
                    FileUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Submissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Submissions_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Submissions_Assignments_AssignmentId",
                        column: x => x.AssignmentId,
                        principalTable: "Assignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c3515c98-1723-4081-a437-41c611659d25", "AQAAAAIAAYagAAAAECM955yrzNKZJ8Mww1SS559QUlcQbfKjRXriuv5wOhkmCNw4jZe9V12f2H3c2ij8xw==", "f5e6e3db-faa7-4a18-9f48-6c06786181e6" });

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_TopicId",
                table: "Assignments",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_AssignmentId",
                table: "Submissions",
                column: "AssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_StudentId",
                table: "Submissions",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Topics_CourseId",
                table: "Topics",
                column: "CourseId");
        }
    }
}
