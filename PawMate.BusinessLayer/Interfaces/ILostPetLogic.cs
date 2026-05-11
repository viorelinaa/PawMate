using PawMate.Domain.Models.LostPet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface ILostPetLogic
{
    ServiceResponse CreateLostPet(LostPetCreateDto lostPet, int userId);
    ServiceResponse GetLostPetById(int id);
    ServiceResponse GetLostPetList(LostPetQueryDto query);
    ServiceResponse UpdateLostPet(int id, LostPetUpdateDto lostPet);
    ServiceResponse DeleteLostPet(int id, int userId, bool isAdmin);
}