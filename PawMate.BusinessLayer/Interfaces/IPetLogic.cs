using PawMate.Domain.Models.Pet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IPetLogic
{
    ServiceResponse CreatePet(PetCreateDto pet, int userId);
    ServiceResponse GetPetById(int id);
    ServiceResponse GetPetList(PetQueryDto query);
    ServiceResponse UpdatePet(int id, PetUpdateDto pet, int userId, bool isAdmin);
    ServiceResponse UpdatePetImage(int id, int userId, bool isAdmin, string imageUrl);
    ServiceResponse DeletePet(int id, int userId, bool isAdmin);
}