using Microsoft.EntityFrameworkCore;
using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.BlogPost;
using PawMate.Domain.Entities.Event;
using PawMate.Domain.Entities.LostPet;
using PawMate.Domain.Entities.Marketplace;
using PawMate.Domain.Entities.Pet;
using PawMate.Domain.Entities.Sitter;
using PawMate.Domain.Entities.User;
using PawMate.Domain.Entities.Volunteer;

namespace PawMate.DataAccessLayer.Context;

public sealed class PawMateDbContext : DbContext
{
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<PetEntity> Pets { get; set; }
    public DbSet<AdoptionEntity> Adoptions { get; set; }
    public DbSet<LostPetEntity> LostPets { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    public DbSet<BlogPostEntity> BlogPosts { get; set; }
    public DbSet<MarketplaceEntity> MarketplaceListings { get; set; }
    public DbSet<VolunteerEntity> VolunteerOpportunities { get; set; }
    public DbSet<SitterEntity> Sitters { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AdoptionEntity>()
            .HasOne(a => a.Pet)
            .WithMany(p => p.Adoptions)
            .HasForeignKey(a => a.PetId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AdoptionEntity>()
            .HasOne(a => a.User)
            .WithMany(u => u.Adoptions)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<BlogPostEntity>()
            .HasOne(b => b.Author)
            .WithMany(u => u.BlogPosts)
            .HasForeignKey(b => b.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MarketplaceEntity>()
            .HasOne(m => m.Seller)
            .WithMany(u => u.MarketplaceListings)
            .HasForeignKey(m => m.SellerId)
            .OnDelete(DeleteBehavior.Restrict);

        base.OnModelCreating(modelBuilder);
    }
}