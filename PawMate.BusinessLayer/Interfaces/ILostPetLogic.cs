using PawMate.Domain.Models.LostPet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface ILostPetLogic
{
    ServiceResponse CreateLostPet(LostPetCreateDto lostPet);
    ServiceResponse GetLostPetById(int id);
    ServiceResponse GetLostPetList();
}
