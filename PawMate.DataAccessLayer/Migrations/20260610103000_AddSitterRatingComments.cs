using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using PawMate.DataAccessLayer.Context;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    [DbContext(typeof(PawMateDbContext))]
    [Migration("20260610103000_AddSitterRatingComments")]
    public partial class AddSitterRatingComments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "SitterRatings",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "SitterRatings");
        }
    }
}
