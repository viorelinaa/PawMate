using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePetSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Pets",
                newName: "Size");

            migrationBuilder.RenameColumn(
                name: "Breed",
                table: "Pets",
                newName: "City");

            migrationBuilder.AlterColumn<string>(
                name: "Age",
                table: "Pets",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "Sterilized",
                table: "Pets",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Vaccinated",
                table: "Pets",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sterilized",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "Vaccinated",
                table: "Pets");

            migrationBuilder.RenameColumn(
                name: "Size",
                table: "Pets",
                newName: "Gender");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Pets",
                newName: "Breed");

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "Pets",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
