using PawMate.Domain.Models.Pet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IPetLogic
{
    ServiceResponse CreatePet(PetCreateDto pet);
    ServiceResponse GetPetById(int id);
    ServiceResponse GetPetList();
    ServiceResponse UpdatePet(int id, PetUpdateDto pet);
    ServiceResponse DeletePet(int id);
}
