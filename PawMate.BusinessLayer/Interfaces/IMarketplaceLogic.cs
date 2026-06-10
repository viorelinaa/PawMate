using PawMate.Domain.Models.Marketplace;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IMarketplaceLogic
{
    ServiceResponse CreateListing(MarketplaceCreateDto listing);
    ServiceResponse GetListingById(int id);
    ServiceResponse GetListingList(MarketplaceQueryDto query);
    ServiceResponse UpdateListing(int id, MarketplaceUpdateDto listing);
    ServiceResponse UpdateListingImage(int id, int userId, bool isAdmin, string imageUrl, string imagePublicId);
    ServiceResponse DeleteListing(int id);
}
