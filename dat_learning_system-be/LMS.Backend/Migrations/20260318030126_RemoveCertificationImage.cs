using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCertificationImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CertificationImage",
                table: "Courses");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3b6888ba-573f-4714-b764-2d08572b19f8", "AQAAAAIAAYagAAAAEIDSJ3YpEGWmb0Iv/ImgnfUKkgiQh/mntar8+5YVBYMNL3TaUJJiedoB8Jd7S91CtQ==", "9ef08012-c7de-4f1b-8090-719a2f3a3fdc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CertificationImage",
                table: "Courses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ae3f016a-c03d-406a-9d93-c20d6c91a51d", "AQAAAAIAAYagAAAAEAOKlkl6XdzISxzS0x1sxq/OFqEDTmYCk/JR6e+aTI6Sa2uqqdBTi03VBPRKxo+isQ==", "58418b25-0fc7-4921-b244-744a8a513093" });
        }
    }
}
