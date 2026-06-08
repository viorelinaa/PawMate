using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddLostPetImageFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePublicId",
                table: "LostPets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "LostPets",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePublicId",
                table: "LostPets");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "LostPets");
        }
    }
}