using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Adoption;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class AdoptionLogic : AdoptionActions, IAdoptionLogic
{
    public ServiceResponse CreateAdoption(AdoptionCreateDto adoption, int userId)
    {
        return CreateAdoptionAction(adoption, userId);
    }

    public ServiceResponse GetAdoptionById(int id, int userId, bool isAdmin)
    {
        return GetAdoptionByIdAction(id, userId, isAdmin);
    }

    public ServiceResponse GetAdoptionList()
    {
        return GetAdoptionListAction();
    }

    public ServiceResponse GetMyAdoptionList(int userId)
    {
        return GetMyAdoptionListAction(userId);
    }

    public ServiceResponse GetReceivedAdoptionList(int userId, bool isAdmin)
    {
        return GetReceivedAdoptionListAction(userId, isAdmin);
    }

    public ServiceResponse UpdateAdoptionStatus(int id, AdoptionStatusUpdateDto status, int userId, bool isAdmin)
    {
        return UpdateAdoptionStatusAction(id, status, userId, isAdmin);
    }
}