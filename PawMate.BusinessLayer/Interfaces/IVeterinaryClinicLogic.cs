using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.VeterinaryClinic;

namespace PawMate.BusinessLayer.Interfaces;

public interface IVeterinaryClinicLogic
{
    ServiceResponse CreateVeterinaryClinic(VeterinaryClinicCreateDto clinic);
    ServiceResponse GetVeterinaryClinicList(VeterinaryClinicQueryDto query);
    ServiceResponse GetVeterinaryClinicById(int id);
    ServiceResponse UpdateVeterinaryClinic(int id, VeterinaryClinicUpdateDto clinic);
    ServiceResponse DeleteVeterinaryClinic(int id);
}
