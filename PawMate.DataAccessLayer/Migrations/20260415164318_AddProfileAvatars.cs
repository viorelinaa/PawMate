using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PawMate.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddProfileAvatars : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProfileAvatarId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProfileAvatars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileAvatars", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_ProfileAvatarId",
                table: "Users",
                column: "ProfileAvatarId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ProfileAvatars_ProfileAvatarId",
                table: "Users",
                column: "ProfileAvatarId",
                principalTable: "ProfileAvatars",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_ProfileAvatars_ProfileAvatarId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "ProfileAvatars");

            migrationBuilder.DropIndex(
                name: "IX_Users_ProfileAvatarId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ProfileAvatarId",
                table: "Users");
        }
    }
}
