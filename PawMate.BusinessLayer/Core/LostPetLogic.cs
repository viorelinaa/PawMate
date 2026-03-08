using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.LostPet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class LostPetLogic : LostPetActions, ILostPetLogic
{
    public ServiceResponse CreateLostPet(LostPetCreateDto lostPet)
    {
        return CreateLostPetAction(lostPet);
    }

    public ServiceResponse GetLostPetById(int id)
    {
        return GetLostPetByIdAction(id);
    }

    public ServiceResponse GetLostPetList()
    {
        return GetLostPetListAction();
    }
}
