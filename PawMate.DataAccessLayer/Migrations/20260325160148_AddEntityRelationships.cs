using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddEntityRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MarketplaceListings_SellerId",
                table: "MarketplaceListings",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_LostPets_PetId",
                table: "LostPets",
                column: "PetId");

            migrationBuilder.CreateIndex(
                name: "IX_LostPets_UserId",
                table: "LostPets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_AuthorId",
                table: "BlogPosts",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Adoptions_PetId",
                table: "Adoptions",
                column: "PetId");

            migrationBuilder.CreateIndex(
                name: "IX_Adoptions_UserId",
                table: "Adoptions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Adoptions_Pets_PetId",
                table: "Adoptions",
                column: "PetId",
                principalTable: "Pets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Adoptions_Users_UserId",
                table: "Adoptions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BlogPosts_Users_AuthorId",
                table: "BlogPosts",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

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

            migrationBuilder.AddForeignKey(
                name: "FK_MarketplaceListings_Users_SellerId",
                table: "MarketplaceListings",
                column: "SellerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Adoptions_Pets_PetId",
                table: "Adoptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Adoptions_Users_UserId",
                table: "Adoptions");

            migrationBuilder.DropForeignKey(
                name: "FK_BlogPosts_Users_AuthorId",
                table: "BlogPosts");

            migrationBuilder.DropForeignKey(
                name: "FK_LostPets_Pets_PetId",
                table: "LostPets");

            migrationBuilder.DropForeignKey(
                name: "FK_LostPets_Users_UserId",
                table: "LostPets");

            migrationBuilder.DropForeignKey(
                name: "FK_MarketplaceListings_Users_SellerId",
                table: "MarketplaceListings");

            migrationBuilder.DropIndex(
                name: "IX_MarketplaceListings_SellerId",
                table: "MarketplaceListings");

            migrationBuilder.DropIndex(
                name: "IX_LostPets_PetId",
                table: "LostPets");

            migrationBuilder.DropIndex(
                name: "IX_LostPets_UserId",
                table: "LostPets");

            migrationBuilder.DropIndex(
                name: "IX_BlogPosts_AuthorId",
                table: "BlogPosts");

            migrationBuilder.DropIndex(
                name: "IX_Adoptions_PetId",
                table: "Adoptions");

            migrationBuilder.DropIndex(
                name: "IX_Adoptions_UserId",
                table: "Adoptions");
        }
    }
}
