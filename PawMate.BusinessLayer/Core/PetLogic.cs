using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Pet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class PetLogic : PetActions, IPetLogic
{
    public ServiceResponse CreatePet(PetCreateDto pet, int userId)
    {
        return CreatePetAction(pet, userId);
    }

    public ServiceResponse GetPetById(int id)
    {
        return GetPetByIdAction(id);
    }

    public ServiceResponse GetPetList(PetQueryDto query)
    {
        return GetPetListAction(query);
    }

    public ServiceResponse UpdatePet(int id, PetUpdateDto pet)
    {
        return UpdatePetAction(id, pet);
    }

    public ServiceResponse DeletePet(int id, int userId, bool isAdmin)
    {
        return DeletePetAction(id, userId, isAdmin);
    }
}