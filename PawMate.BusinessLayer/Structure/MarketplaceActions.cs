using PawMate.DataAccessLayer.Context;
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
        throw new NotImplementedException();
    }

    public ServiceResponse GetListingByIdAction(int id)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetListingListAction()
    {
        throw new NotImplementedException();
    }
}
