using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Marketplace;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class MarketplaceLogic : MarketplaceActions, IMarketplaceLogic
{
    public ServiceResponse CreateListing(MarketplaceCreateDto listing)
    {
        return CreateListingAction(listing);
    }

    public ServiceResponse GetListingById(int id)
    {
        return GetListingByIdAction(id);
    }

    public ServiceResponse GetListingList(MarketplaceQueryDto query)
    {
        return GetListingListAction(query);
    }

    public ServiceResponse UpdateListing(int id, MarketplaceUpdateDto listing)
    {
        return UpdateListingAction(id, listing);
    }

    public ServiceResponse DeleteListing(int id)
    {
        return DeleteListingAction(id);
    }
}
