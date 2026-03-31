using PawMate.BusinessLayer.Core;
using PawMate.BusinessLayer.Interfaces;

namespace PawMate.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IUserLogic GetUserLogic()
    {
        return new UserLogic();
    }

    public IPetLogic GetPetLogic()
    {
        return new PetLogic();
    }

    public IAdoptionLogic GetAdoptionLogic()
    {
        return new AdoptionLogic();
    }

    public ILostPetLogic GetLostPetLogic()
    {
        return new LostPetLogic();
    }

    public IEventLogic GetEventLogic()
    {
        return new EventLogic();
    }

    public IBlogPostLogic GetBlogPostLogic()
    {
        return new BlogPostLogic();
    }

    public IMarketplaceLogic GetMarketplaceLogic()
    {
        return new MarketplaceLogic();
    }

    public IVolunteerLogic GetVolunteerLogic()
    {
        return new VolunteerLogic();
    }

    public IUserAuthLogic GetUserAuthLogic()
    {
        return new UserAuthLogic();
    }

    public ISitterLogic GetSitterLogic()
    {
        return new SitterLogic();
    }
}