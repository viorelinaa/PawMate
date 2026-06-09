using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddAdoptionRequestDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicantName",
                table: "Adoptions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ApplicantPhone",
                table: "Adoptions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AnimalExperience",
                table: "Adoptions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LivingConditions",
                table: "Adoptions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "Adoptions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedAt",
                table: "Adoptions",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "ApplicantName", table: "Adoptions");
            migrationBuilder.DropColumn(name: "ApplicantPhone", table: "Adoptions");
            migrationBuilder.DropColumn(name: "AnimalExperience", table: "Adoptions");
            migrationBuilder.DropColumn(name: "LivingConditions", table: "Adoptions");
            migrationBuilder.DropColumn(name: "Message", table: "Adoptions");
            migrationBuilder.DropColumn(name: "ReviewedAt", table: "Adoptions");
        }
    }
}