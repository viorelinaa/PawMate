using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Marketplace;
using PawMate.Domain.Models.Marketplace;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class MarketplaceActions
{
    private readonly PawMateDbContext _context;

    public MarketplaceActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateListingAction(MarketplaceCreateDto listing)
    {
        try
        {
            var entity = new MarketplaceEntity
            {
                Title = listing.Title,
                Description = listing.Description,
                Category = listing.Category,
                Price = listing.Price,
                SellerId = listing.SellerId
            };

            _context.MarketplaceListings.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Anunțul de vânzare a fost publicat cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            var detail = ex.InnerException?.Message ?? ex.Message;
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la publicarea anunțului: {detail}"
            };
        }
    }

    public ServiceResponse GetListingByIdAction(int id)
    {
        try
        {
            var entity = _context.MarketplaceListings.FirstOrDefault(m => m.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Anunțul de vânzare nu a fost găsit."
                };
            }

            var dto = new MarketplaceInfoDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                Category = entity.Category,
                Price = entity.Price,
                SellerId = entity.SellerId
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Anunțul de vânzare a fost găsit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea anunțului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetListingListAction(MarketplaceQueryDto query)
    {
        try
        {
            var listingsQuery = _context.MarketplaceListings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim().ToLower();
                listingsQuery = listingsQuery.Where(m =>
                    m.Title.ToLower().Contains(search) ||
                    m.Description.ToLower().Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(query.Category) && query.Category != "ALL")
            {
                listingsQuery = listingsQuery.Where(m => m.Category == query.Category);
            }

            listingsQuery = query.SortBy?.ToLower() switch
            {
                "price" when query.SortDirection == "desc" => listingsQuery.OrderByDescending(m => m.Price),
                "price" => listingsQuery.OrderBy(m => m.Price),
                "title" when query.SortDirection == "desc" => listingsQuery.OrderByDescending(m => m.Title),
                "title" => listingsQuery.OrderBy(m => m.Title),
                _ => listingsQuery.OrderByDescending(m => m.Id)
            };

            var list = listingsQuery
                .Select(m => new MarketplaceInfoDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    Category = m.Category,
                    Price = m.Price,
                    SellerId = m.SellerId
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista anunturilor de vanzare a fost obtinuta cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea listei de anunturi: {ex.Message}"
            };
        }
    }

    public ServiceResponse UpdateListingAction(int id, MarketplaceUpdateDto listing)
    {
        try
        {
            var entity = _context.MarketplaceListings.FirstOrDefault(m => m.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Anunțul de vânzare nu a fost găsit."
                };
            }

            entity.Title = listing.Title;
            entity.Description = listing.Description;
            entity.Category = listing.Category;
            entity.Price = listing.Price;

            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Anunțul de vânzare a fost actualizat cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la actualizarea anunțului: {ex.Message}"
            };
        }
    }

    public ServiceResponse DeleteListingAction(int id)
    {
        try
        {
            var entity = _context.MarketplaceListings.FirstOrDefault(m => m.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Anunțul de vânzare nu a fost găsit."
                };
            }

            _context.MarketplaceListings.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Anunțul de vânzare a fost șters cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la ștergerea anunțului: {ex.Message}"
            };
        }
    }
}
