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

            int totalPets = _context.Pets.Count();
            int lostPetsActive = _context.LostPets.Count(lp => !lp.IsFound);
            int lostPetsRecoveredThisMonth = _context.LostPets
                .Count(lp => lp.IsFound && lp.LostDate >= startOfMonth);
            int totalUsers = _context.Users.Count();
            int newUsersThisWeek = _context.Users.Count(u => u.CreatedAt >= startOfWeek);
            int totalSitters = _context.Sitters.Count();

            // Activitate lunară — ultimele 12 luni
            var monthlyData = new List<MonthlyStatDto>();
            for (int i = 11; i >= 0; i--)
            {
                var date = now.AddMonths(-i);
                int year = date.Year;
                int month = date.Month;

                monthlyData.Add(new MonthlyStatDto
                {
                    Month = MonthNames[month - 1],
                    Year = year,
                    Adoptii = _context.Adoptions.Count(a => a.CreatedAt.Year == year && a.CreatedAt.Month == month),
                    Pierdute = _context.LostPets.Count(lp => lp.LostDate.Year == year && lp.LostDate.Month == month),
                    Evenimente = _context.Events.Count(e => e.Date.Year == year && e.Date.Month == month)
                });
            }

            // Activitate recentă
            var recentActivity = new List<RecentActivityDto>();

            recentActivity.AddRange(_context.Adoptions
                .OrderByDescending(a => a.CreatedAt).Take(3)
                .Select(a => new RecentActivityDto
                {
                    Type = "adoption",
                    Action = "Cerere adopție nouă",
                    Detail = a.Pet.Name + ", " + a.Pet.Species,
                    Date = a.CreatedAt
                }).ToList());

            recentActivity.AddRange(_context.Users
                .OrderByDescending(u => u.CreatedAt).Take(3)
                .Select(u => new RecentActivityDto
                {
                    Type = "user",
                    Action = "Utilizator nou înregistrat",
                    Detail = u.Name + ", " + u.City,
                    Date = u.CreatedAt
                }).ToList());

            recentActivity.AddRange(_context.Events
                .OrderByDescending(e => e.Date).Take(3)
                .Select(e => new RecentActivityDto
                {
                    Type = "event",
                    Action = "Eveniment creat",
                    Detail = e.Title + ", " + e.Location,
                    Date = e.Date
                }).ToList());

            recentActivity.AddRange(_context.LostPets
                .OrderByDescending(lp => lp.LostDate).Take(3)
                .Select(lp => new RecentActivityDto
                {
                    Type = "lostpet",
                    Action = "Animal pierdut raportat",
                    Detail = lp.Species + ", " + lp.City,
                    Date = lp.LostDate
                }).ToList());

            recentActivity.AddRange(_context.BlogPosts
                .OrderByDescending(b => b.CreatedAt).Take(2)
                .Select(b => new RecentActivityDto
                {
                    Type = "blog",
                    Action = "Articol nou pe blog",
                    Detail = b.Title,
                    Date = b.CreatedAt
                }).ToList());

            var contentCounts = new ContentCountsDto
            {
                Adoptii = _context.Adoptions.Count(),
                BlogPosts = _context.BlogPosts.Count(),
                VeterinaryClinics = _context.VeterinaryClinics.Count(),
                QuizResults = _context.QuizResults.Count(),
                MarketplaceListings = _context.MarketplaceListings.Count(),
                Evenimente = _context.Events.Count()
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Statisticile au fost obținute cu succes.",
                Data = new StatisticsSummaryDto
                {
                    TotalPets = totalPets,
                    LostPetsActive = lostPetsActive,
                    LostPetsRecoveredThisMonth = lostPetsRecoveredThisMonth,
                    TotalUsers = totalUsers,
                    NewUsersThisWeek = newUsersThisWeek,
                    TotalSitters = totalSitters,
                    MonthlyData = monthlyData,
                    RecentActivity = recentActivity.OrderByDescending(a => a.Date).Take(8).ToList(),
                    ContentCounts = contentCounts
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
}
