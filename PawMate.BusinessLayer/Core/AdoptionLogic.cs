using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Adoption;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class AdoptionLogic : AdoptionActions, IAdoptionLogic
{
    public ServiceResponse CreateAdoption(AdoptionCreateDto adoption)
    {
        return CreateAdoptionAction(adoption);
    }

    public ServiceResponse GetAdoptionById(int id)
    {
        return GetAdoptionByIdAction(id);
    }

    public ServiceResponse GetAdoptionList()
    {
        return GetAdoptionListAction();
    }
}
