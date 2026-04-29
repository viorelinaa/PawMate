using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddVeterinaryClinicMapUrls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppleMapsUrl",
                table: "VeterinaryClinics",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GoogleMapsUrl",
                table: "VeterinaryClinics",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppleMapsUrl",
                table: "VeterinaryClinics");

            migrationBuilder.DropColumn(
                name: "GoogleMapsUrl",
                table: "VeterinaryClinics");
        }
    }
}
