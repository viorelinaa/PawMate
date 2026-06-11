using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.LostPet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class LostPetLogic : LostPetActions, ILostPetLogic
{
    public ServiceResponse CreateLostPet(LostPetCreateDto lostPet, int userId) => CreateLostPetAction(lostPet, userId);
    public ServiceResponse GetLostPetById(int id) => GetLostPetByIdAction(id);
    public ServiceResponse GetLostPetList(LostPetQueryDto query) => GetLostPetListAction(query);
    public ServiceResponse UpdateLostPetImage(int id, int userId, bool isAdmin, string imageUrl, string imagePublicId) => UpdateLostPetImageAction(id, userId, isAdmin, imageUrl, imagePublicId);
    public ServiceResponse UpdateLostPet(int id, int userId, bool isAdmin, LostPetUpdateDto lostPet) => UpdateLostPetAction(id, userId, isAdmin, lostPet);
    public ServiceResponse DeleteLostPet(int id, int userId, bool isAdmin) => DeleteLostPetAction(id, userId, isAdmin);
}
