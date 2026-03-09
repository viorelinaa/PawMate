using PawMate.Domain.Models.Marketplace;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IMarketplaceLogic
{
    ServiceResponse CreateListing(MarketplaceCreateDto listing);
    ServiceResponse GetListingById(int id);
    ServiceResponse GetListingList();
}
