using PawMate.Domain.Models.Adoption;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IAdoptionLogic
{
    ServiceResponse CreateAdoption(AdoptionCreateDto adoption, int userId);
    ServiceResponse GetAdoptionById(int id, int userId, bool isAdmin);
    ServiceResponse GetAdoptionList();
    ServiceResponse GetMyAdoptionList(int userId);
    ServiceResponse GetReceivedAdoptionList(int userId, bool isAdmin);
    ServiceResponse UpdateAdoptionStatus(int id, AdoptionStatusUpdateDto status, int userId, bool isAdmin);
}