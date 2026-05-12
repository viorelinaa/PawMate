using Microsoft.EntityFrameworkCore;
using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.BlogPost;
using PawMate.Domain.Entities.Event;
using PawMate.Domain.Entities.LostPet;
using PawMate.Domain.Entities.Marketplace;
using PawMate.Domain.Entities.Pet;
using PawMate.Domain.Entities.ProfileAvatar;
using PawMate.Domain.Entities.QuizResult;
using PawMate.Domain.Entities.RefreshToken;
using PawMate.Domain.Entities.Sitter;
using PawMate.Domain.Entities.User;
using PawMate.Domain.Entities.VeterinaryClinic;
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
    public DbSet<VeterinaryClinicEntity> VeterinaryClinics { get; set; }
    public DbSet<ProfileAvatarEntity> ProfileAvatars { get; set; }
    public DbSet<QuizResultEntity> QuizResults { get; set; }
    public DbSet<RefreshTokenEntity> RefreshTokens { get; set; }

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

        modelBuilder.Entity<PetEntity>()
            .HasOne(p => p.User)
            .WithMany(u => u.Pets)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.SetNull);

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

        modelBuilder.Entity<QuizResultEntity>()
            .HasOne(q => q.User)
            .WithMany(u => u.QuizResults)
            .HasForeignKey(q => q.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserEntity>()
            .HasOne(u => u.ProfileAvatar)
            .WithMany(a => a.Users)
            .HasForeignKey(u => u.ProfileAvatarId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<UserEntity>()
            .Property(u => u.Address)
            .HasDefaultValue(string.Empty);

        modelBuilder.Entity<UserEntity>()
            .Property(u => u.Status)
            .HasDefaultValue("offline");

        modelBuilder.Entity<UserEntity>()
            .Property(u => u.LoginCount)
            .HasDefaultValue(0);

        modelBuilder.Entity<UserEntity>()
            .Property(u => u.IsEmailVerified)
            .HasDefaultValue(false);

        modelBuilder.Entity<ProfileAvatarEntity>()
            .Property(a => a.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<QuizResultEntity>()
            .Property(q => q.CompletedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<UserEntity>()
            .Property(u => u.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<RefreshTokenEntity>()
            .HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RefreshTokenEntity>()
            .Property(rt => rt.CreatedAt)
            .HasDefaultValueSql("NOW()");

        base.OnModelCreating(modelBuilder);
    }
}
