using Microsoft.EntityFrameworkCore;
using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.BlogPost;
using PawMate.Domain.Entities.Event;
using PawMate.Domain.Entities.LostPet;
using PawMate.Domain.Entities.Marketplace;
using PawMate.Domain.Entities.Pet;
using PawMate.Domain.Entities.User;
using PawMate.Domain.Entities.Volunteer;

namespace PawMate.DataAccessLayer.Context;

public sealed class PawMateDbContext : DbContext
{
    public PawMateDbContext() { }
    public PawMateDbContext(DbContextOptions<PawMateDbContext> options) : base(options) { }

    public DbSet<UserEntity> Users { get; set; }
    public DbSet<PetEntity> Pets { get; set; }
    public DbSet<AdoptionEntity> Adoptions { get; set; }
    public DbSet<LostPetEntity> LostPets { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    public DbSet<BlogPostEntity> BlogPosts { get; set; }
    public DbSet<MarketplaceEntity> MarketplaceListings { get; set; }
    public DbSet<VolunteerEntity> VolunteerOpportunities { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=pawmatedb;Username=postgres;Password=postgres");
        }
    }
}
