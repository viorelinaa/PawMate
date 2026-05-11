using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.LostPet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class LostPetLogic : LostPetActions, ILostPetLogic
{
    public ServiceResponse CreateLostPet(LostPetCreateDto lostPet) => CreateLostPetAction(lostPet);
    public ServiceResponse GetLostPetById(int id) => GetLostPetByIdAction(id);
    public ServiceResponse GetLostPetList(LostPetQueryDto query) => GetLostPetListAction(query);
    public ServiceResponse UpdateLostPet(int id, LostPetUpdateDto lostPet) => UpdateLostPetAction(id, lostPet);
    public ServiceResponse DeleteLostPet(int id) => DeleteLostPetAction(id);
}
