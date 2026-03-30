using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class RedesignLostPetSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LostPets_Pets_PetId",
                table: "LostPets");

            migrationBuilder.DropForeignKey(
                name: "FK_LostPets_Users_UserId",
                table: "LostPets");

            migrationBuilder.DropIndex(
                name: "IX_LostPets_PetId",
                table: "LostPets");

            migrationBuilder.DropIndex(
                name: "IX_LostPets_UserId",
                table: "LostPets");

            migrationBuilder.DropColumn(
                name: "PetId",
                table: "LostPets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "LostPets");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "LostPets",
                newName: "Species");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "LostPets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Contact",
                table: "LostPets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "LostPets",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "LostPets");

            migrationBuilder.DropColumn(
                name: "Contact",
                table: "LostPets");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "LostPets");

            migrationBuilder.RenameColumn(
                name: "Species",
                table: "LostPets",
                newName: "Location");

            migrationBuilder.AddColumn<int>(
                name: "PetId",
                table: "LostPets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "LostPets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_LostPets_PetId",
                table: "LostPets",
                column: "PetId");

            migrationBuilder.CreateIndex(
                name: "IX_LostPets_UserId",
                table: "LostPets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_LostPets_Pets_PetId",
                table: "LostPets",
                column: "PetId",
                principalTable: "Pets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LostPets_Users_UserId",
                table: "LostPets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
