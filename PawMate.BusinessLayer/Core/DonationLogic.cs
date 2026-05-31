using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Donation;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class DonationLogic : DonationActions, IDonationLogic
{
    public ServiceResponse CreateDonation(DonationCreateDto dto) => CreateDonationAction(dto);
    public ServiceResponse UpdateDonation(int id, DonationUpdateDto dto) => UpdateDonationAction(id, dto);
    public ServiceResponse DeleteDonation(int id) => DeleteDonationAction(id);
    public ServiceResponse GetDonationById(int id) => GetDonationByIdAction(id);
    public ServiceResponse GetDonationList() => GetDonationListAction();
}
