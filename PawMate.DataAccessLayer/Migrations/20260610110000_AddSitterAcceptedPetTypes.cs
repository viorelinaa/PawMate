using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using PawMate.DataAccessLayer.Context;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    [DbContext(typeof(PawMateDbContext))]
    [Migration("20260610110000_AddSitterAcceptedPetTypes")]
    public partial class AddSitterAcceptedPetTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AcceptedPetTypes",
                table: "Sitters",
                type: "text",
                nullable: false,
                defaultValue: "Orice");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcceptedPetTypes",
                table: "Sitters");
        }
    }
}
