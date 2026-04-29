using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.VeterinaryClinic;

namespace PawMate.BusinessLayer.Core;

public class VeterinaryClinicLogic : VeterinaryClinicActions, IVeterinaryClinicLogic
{
    public ServiceResponse CreateVeterinaryClinic(VeterinaryClinicCreateDto clinic)
    {
        return CreateVeterinaryClinicAction(clinic);
    }

    public ServiceResponse GetVeterinaryClinicList()
    {
        return GetVeterinaryClinicListAction();
    }

    public ServiceResponse GetVeterinaryClinicById(int id)
    {
        return GetVeterinaryClinicByIdAction(id);
    }

    public ServiceResponse UpdateVeterinaryClinic(int id, VeterinaryClinicUpdateDto clinic)
    {
        return UpdateVeterinaryClinicAction(id, clinic);
    }

    public ServiceResponse DeleteVeterinaryClinic(int id)
    {
        return DeleteVeterinaryClinicAction(id);
    }
}
