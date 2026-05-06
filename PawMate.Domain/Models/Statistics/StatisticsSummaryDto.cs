namespace PawMate.Domain.Models.Statistics;

public class StatisticsSummaryDto
{
    public int TotalPets { get; set; }
    public int LostPetsActive { get; set; }
    public int LostPetsRecoveredThisMonth { get; set; }
    public int TotalUsers { get; set; }
    public int NewUsersThisWeek { get; set; }
    public int TotalSitters { get; set; }

    public List<MonthlyStatDto> MonthlyData { get; set; } = new();
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
    public ContentCountsDto ContentCounts { get; set; } = new();
}

public class MonthlyStatDto
{
    public string Month { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Adoptii { get; set; }
    public int Pierdute { get; set; }
    public int Evenimente { get; set; }
}

public class RecentActivityDto
{
    public string Type { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}

public class ContentCountsDto
{
    public int Adoptii { get; set; }
    public int BlogPosts { get; set; }
    public int VeterinaryClinics { get; set; }
    public int QuizResults { get; set; }
    public int MarketplaceListings { get; set; }
    public int Evenimente { get; set; }
}
