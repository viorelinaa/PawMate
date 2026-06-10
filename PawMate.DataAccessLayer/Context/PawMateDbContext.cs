using Microsoft.EntityFrameworkCore;
using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.BlogPost;
using PawMate.Domain.Entities.Chat;
using PawMate.Domain.Entities.Donation;
using PawMate.Domain.Entities.Event;
using PawMate.Domain.Entities.LostPet;
using PawMate.Domain.Entities.Marketplace;
using PawMate.Domain.Entities.Order;
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
    public DbSet<DonationEntity> Donations { get; set; }
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<PetEntity> Pets { get; set; }
    public DbSet<AdoptionEntity> Adoptions { get; set; }
    public DbSet<LostPetEntity> LostPets { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    public DbSet<BlogPostEntity> BlogPosts { get; set; }
    public DbSet<MarketplaceEntity> MarketplaceListings { get; set; }
    public DbSet<OrderEntity> Orders { get; set; }
    public DbSet<OrderItemEntity> OrderItems { get; set; }
    public DbSet<VolunteerEntity> VolunteerOpportunities { get; set; }
    public DbSet<VolunteerApplicationEntity> VolunteerApplications { get; set; }
    public DbSet<SitterEntity> Sitters { get; set; }
    public DbSet<SitterRatingEntity> SitterRatings { get; set; }
    public DbSet<VeterinaryClinicEntity> VeterinaryClinics { get; set; }
    public DbSet<ProfileAvatarEntity> ProfileAvatars { get; set; }
    public DbSet<QuizResultEntity> QuizResults { get; set; }
    public DbSet<RefreshTokenEntity> RefreshTokens { get; set; }
    public DbSet<ChatConversationEntity> ChatConversations { get; set; }
    public DbSet<ChatMessageEntity> ChatMessages { get; set; }

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

        modelBuilder.Entity<OrderEntity>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderEntity>()
            .Property(o => o.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<OrderEntity>()
            .Property(o => o.Status)
            .HasDefaultValue("Pending");

        modelBuilder.Entity<OrderItemEntity>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItemEntity>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<QuizResultEntity>()
            .HasOne(q => q.User)
            .WithMany(u => u.QuizResults)
            .HasForeignKey(q => q.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<VolunteerApplicationEntity>()
            .HasOne(v => v.User)
            .WithMany()
            .HasForeignKey(v => v.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<VolunteerApplicationEntity>()
            .HasOne(v => v.ReviewedByAdmin)
            .WithMany()
            .HasForeignKey(v => v.ReviewedByAdminId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<VolunteerApplicationEntity>()
            .Property(v => v.Status)
            .HasDefaultValue("pending");

        modelBuilder.Entity<VolunteerApplicationEntity>()
            .Property(v => v.AdminComment)
            .HasDefaultValue(string.Empty);

        modelBuilder.Entity<VolunteerApplicationEntity>()
            .Property(v => v.CreatedAt)
            .HasDefaultValueSql("NOW()");

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


        modelBuilder.Entity<SitterEntity>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<SitterEntity>()
            .Property(s => s.AcceptedPetTypes)
            .HasDefaultValue("Orice");

        modelBuilder.Entity<SitterRatingEntity>()
            .HasIndex(r => new { r.SitterId, r.UserId })
            .IsUnique();

        modelBuilder.Entity<SitterRatingEntity>()
            .ToTable(t => t.HasCheckConstraint("CK_SitterRatings_Rating", "\"Rating\" >= 1 AND \"Rating\" <= 5"));

        modelBuilder.Entity<SitterRatingEntity>()
            .HasOne(r => r.Sitter)
            .WithMany(s => s.Ratings)
            .HasForeignKey(r => r.SitterId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SitterRatingEntity>()
            .HasOne(r => r.User)
            .WithMany(u => u.SitterRatings)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<SitterRatingEntity>()
            .Property(r => r.Comment)
            .HasDefaultValue(string.Empty);

        modelBuilder.Entity<SitterRatingEntity>()
            .Property(r => r.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<SitterRatingEntity>()
            .Property(r => r.UpdatedAt)
            .HasDefaultValueSql("NOW()");
        modelBuilder.Entity<ChatConversationEntity>()
            .HasIndex(c => new { c.ClientUserId, c.SitterId })
            .IsUnique();
        modelBuilder.Entity<ChatConversationEntity>()
            .HasOne(c => c.ClientUser)
            .WithMany(u => u.ChatConversationsAsClient)
            .HasForeignKey(c => c.ClientUserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ChatConversationEntity>()
            .HasOne(c => c.SitterUser)
            .WithMany(u => u.ChatConversationsAsSitter)
            .HasForeignKey(c => c.SitterUserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ChatConversationEntity>()
            .HasOne(c => c.Sitter)
            .WithMany(s => s.ChatConversations)
            .HasForeignKey(c => c.SitterId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ChatConversationEntity>()
            .Property(c => c.CreatedAt)
            .HasDefaultValueSql("NOW()");
        modelBuilder.Entity<ChatConversationEntity>()
            .Property(c => c.LastMessageAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<ChatMessageEntity>()
            .HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ChatMessageEntity>()
            .HasOne(m => m.SenderUser)
            .WithMany(u => u.ChatMessages)
            .HasForeignKey(m => m.SenderUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ChatMessageEntity>()
            .Property(m => m.CreatedAt)
            .HasDefaultValueSql("NOW()");
        base.OnModelCreating(modelBuilder);
    }
}
