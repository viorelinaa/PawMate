using PawMate.Domain.Models.LostPet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface ILostPetLogic
{
    ServiceResponse CreateLostPet(LostPetCreateDto lostPet, int userId);
    ServiceResponse GetLostPetById(int id);
    ServiceResponse GetLostPetList(LostPetQueryDto query);
    ServiceResponse UpdateLostPetImage(int id, int userId, bool isAdmin, string imageUrl, string imagePublicId);
    ServiceResponse UpdateLostPet(int id, int userId, bool isAdmin, LostPetUpdateDto lostPet);
    ServiceResponse DeleteLostPet(int id, int userId, bool isAdmin);
}
