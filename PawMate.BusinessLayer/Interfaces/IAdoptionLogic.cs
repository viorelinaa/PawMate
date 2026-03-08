using PawMate.Domain.Models.Adoption;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IAdoptionLogic
{
    ServiceResponse CreateAdoption(AdoptionCreateDto adoption);
    ServiceResponse GetAdoptionById(int id);
    ServiceResponse GetAdoptionList();
}
