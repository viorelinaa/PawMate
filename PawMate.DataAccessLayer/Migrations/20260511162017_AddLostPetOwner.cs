using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddLostPetOwner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "LostPets",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LostPets_UserId",
                table: "LostPets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_LostPets_Users_UserId",
                table: "LostPets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LostPets_Users_UserId",
                table: "LostPets");

            migrationBuilder.DropIndex(
                name: "IX_LostPets_UserId",
                table: "LostPets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "LostPets");
        }
    }
}
