using Microsoft.EntityFrameworkCore;
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
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la publicarea anunțului: {ex.Message}"
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

    public ServiceResponse GetListingListAction()
    {
        try
        {
            var list = _context.MarketplaceListings
                .Select(m => new MarketplaceInfoDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    Price = m.Price,
                    SellerId = m.SellerId
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista anunțurilor de vânzare a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea listei de anunțuri: {ex.Message}"
            };
        }
    }
}
