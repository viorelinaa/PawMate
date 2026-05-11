using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Statistics;

namespace PawMate.BusinessLayer.Structure;

public class StatisticsActions
{
    private readonly PawMateDbContext _context;

    private static readonly string[] MonthNames =
        ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    public StatisticsActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse GetSummaryAction()
    {
        try
        {
            var now = DateTime.UtcNow;
            var startOfWeek = now.AddDays(-7);
            var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var monthlyStart = startOfMonth.AddMonths(-11);
            var monthlyEnd = startOfMonth.AddMonths(1);

            var counts = GetCounts(startOfWeek, startOfMonth);
            var monthlyData = GetMonthlyData(monthlyStart, startOfMonth, monthlyEnd);
            var recentActivity = GetRecentActivity();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Statisticile au fost obținute cu succes.",
                Data = new StatisticsSummaryDto
                {
                    TotalPets = counts.TotalPets,
                    LostPetsActive = counts.LostPetsActive,
                    LostPetsRecoveredThisMonth = counts.LostPetsRecoveredThisMonth,
                    TotalUsers = counts.TotalUsers,
                    NewUsersThisWeek = counts.NewUsersThisWeek,
                    TotalSitters = counts.TotalSitters,
                    MonthlyData = monthlyData,
                    RecentActivity = recentActivity,
                    ContentCounts = new ContentCountsDto
                    {
                        Adoptii = counts.Adoptii,
                        BlogPosts = counts.BlogPosts,
                        VeterinaryClinics = counts.VeterinaryClinics,
                        QuizResults = counts.QuizResults,
                        MarketplaceListings = counts.MarketplaceListings,
                        Evenimente = counts.Evenimente
                    }
                }
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"Eroare la obținerea statisticilor: {ex.Message}"
            };
        }
    }

    private StatisticsCountsRow GetCounts(DateTime startOfWeek, DateTime startOfMonth)
    {
        return _context.Database.SqlQuery<StatisticsCountsRow>($"""
            SELECT
                (SELECT COUNT(*)::int FROM "Pets") AS "TotalPets",
                (SELECT COUNT(*)::int FROM "LostPets" WHERE NOT "IsFound") AS "LostPetsActive",
                (SELECT COUNT(*)::int FROM "LostPets" WHERE "IsFound" AND "LostDate" >= {startOfMonth}) AS "LostPetsRecoveredThisMonth",
                (SELECT COUNT(*)::int FROM "Users") AS "TotalUsers",
                (SELECT COUNT(*)::int FROM "Users" WHERE "CreatedAt" >= {startOfWeek}) AS "NewUsersThisWeek",
                (SELECT COUNT(*)::int FROM "Sitters") AS "TotalSitters",
                (SELECT COUNT(*)::int FROM "Adoptions") AS "Adoptii",
                (SELECT COUNT(*)::int FROM "BlogPosts") AS "BlogPosts",
                (SELECT COUNT(*)::int FROM "VeterinaryClinics") AS "VeterinaryClinics",
                (SELECT COUNT(*)::int FROM "QuizResults") AS "QuizResults",
                (SELECT COUNT(*)::int FROM "MarketplaceListings") AS "MarketplaceListings",
                (SELECT COUNT(*)::int FROM "Events") AS "Evenimente"
            """).Single();
    }

    private List<MonthlyStatDto> GetMonthlyData(DateTime monthlyStart, DateTime startOfMonth, DateTime monthlyEnd)
    {
        var rows = _context.Database.SqlQuery<MonthlyStatRow>($"""
            WITH months AS (
                SELECT "StartDate"
                FROM generate_series({monthlyStart}, {startOfMonth}, interval '1 month') AS month_series("StartDate")
            ),
            adoption_months AS (
                SELECT date_trunc('month', "CreatedAt") AS "StartDate", COUNT(*)::int AS "Count"
                FROM "Adoptions"
                WHERE "CreatedAt" >= {monthlyStart} AND "CreatedAt" < {monthlyEnd}
                GROUP BY date_trunc('month', "CreatedAt")
            ),
            lost_pet_months AS (
                SELECT date_trunc('month', "LostDate") AS "StartDate", COUNT(*)::int AS "Count"
                FROM "LostPets"
                WHERE "LostDate" >= {monthlyStart} AND "LostDate" < {monthlyEnd}
                GROUP BY date_trunc('month', "LostDate")
            ),
            event_months AS (
                SELECT date_trunc('month', "Date") AS "StartDate", COUNT(*)::int AS "Count"
                FROM "Events"
                WHERE "Date" >= {monthlyStart} AND "Date" < {monthlyEnd}
                GROUP BY date_trunc('month', "Date")
            )
            SELECT
                EXTRACT(MONTH FROM months."StartDate")::int AS "MonthNumber",
                EXTRACT(YEAR FROM months."StartDate")::int AS "Year",
                COALESCE(adoption_months."Count", 0)::int AS "Adoptii",
                COALESCE(lost_pet_months."Count", 0)::int AS "Pierdute",
                COALESCE(event_months."Count", 0)::int AS "Evenimente"
            FROM months
            LEFT JOIN adoption_months ON adoption_months."StartDate" = months."StartDate"
            LEFT JOIN lost_pet_months ON lost_pet_months."StartDate" = months."StartDate"
            LEFT JOIN event_months ON event_months."StartDate" = months."StartDate"
            ORDER BY months."StartDate"
            """).ToList();

        return rows.Select(row => new MonthlyStatDto
        {
            Month = MonthNames[row.MonthNumber - 1],
            Year = row.Year,
            Adoptii = row.Adoptii,
            Pierdute = row.Pierdute,
            Evenimente = row.Evenimente
        }).ToList();
    }

    private List<RecentActivityDto> GetRecentActivity()
    {
        return _context.Database.SqlQueryRaw<RecentActivityDto>("""
            SELECT "Type", "Action", "Detail", "Date"
            FROM (
                SELECT
                    'adoption' AS "Type",
                    'Cerere adopție nouă' AS "Action",
                    COALESCE(p."Name", '') || ', ' || COALESCE(p."Species", '') AS "Detail",
                    a."CreatedAt" AS "Date"
                FROM "Adoptions" AS a
                INNER JOIN "Pets" AS p ON p."Id" = a."PetId"
                ORDER BY a."CreatedAt" DESC
                LIMIT 3
            ) AS adoption_recent
            UNION ALL
            SELECT "Type", "Action", "Detail", "Date"
            FROM (
                SELECT
                    'user' AS "Type",
                    'Utilizator nou înregistrat' AS "Action",
                    COALESCE(u."Name", '') || ', ' || COALESCE(u."City", '') AS "Detail",
                    u."CreatedAt" AS "Date"
                FROM "Users" AS u
                ORDER BY u."CreatedAt" DESC
                LIMIT 3
            ) AS user_recent
            UNION ALL
            SELECT "Type", "Action", "Detail", "Date"
            FROM (
                SELECT
                    'event' AS "Type",
                    'Eveniment creat' AS "Action",
                    COALESCE(e."Title", '') || ', ' || COALESCE(e."Location", '') AS "Detail",
                    e."Date" AS "Date"
                FROM "Events" AS e
                ORDER BY e."Date" DESC
                LIMIT 3
            ) AS event_recent
            UNION ALL
            SELECT "Type", "Action", "Detail", "Date"
            FROM (
                SELECT
                    'lostpet' AS "Type",
                    'Animal pierdut raportat' AS "Action",
                    COALESCE(lp."Species", '') || ', ' || COALESCE(lp."City", '') AS "Detail",
                    lp."LostDate" AS "Date"
                FROM "LostPets" AS lp
                ORDER BY lp."LostDate" DESC
                LIMIT 3
            ) AS lost_pet_recent
            UNION ALL
            SELECT "Type", "Action", "Detail", "Date"
            FROM (
                SELECT
                    'blog' AS "Type",
                    'Articol nou pe blog' AS "Action",
                    COALESCE(b."Title", '') AS "Detail",
                    b."CreatedAt" AS "Date"
                FROM "BlogPosts" AS b
                ORDER BY b."CreatedAt" DESC
                LIMIT 2
            ) AS blog_recent
            ORDER BY "Date" DESC
            LIMIT 8
            """).ToList();
    }

    private sealed class StatisticsCountsRow
    {
        public int TotalPets { get; set; }
        public int LostPetsActive { get; set; }
        public int LostPetsRecoveredThisMonth { get; set; }
        public int TotalUsers { get; set; }
        public int NewUsersThisWeek { get; set; }
        public int TotalSitters { get; set; }
        public int Adoptii { get; set; }
        public int BlogPosts { get; set; }
        public int VeterinaryClinics { get; set; }
        public int QuizResults { get; set; }
        public int MarketplaceListings { get; set; }
        public int Evenimente { get; set; }
    }

    private sealed class MonthlyStatRow
    {
        public int MonthNumber { get; set; }
        public int Year { get; set; }
        public int Adoptii { get; set; }
        public int Pierdute { get; set; }
        public int Evenimente { get; set; }
    }
}
