using PawMate.Domain.Models.Donation;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IDonationLogic
{
    ServiceResponse CreateDonation(DonationCreateDto dto);
    ServiceResponse UpdateDonation(int id, DonationUpdateDto dto);
    ServiceResponse DeleteDonation(int id);
    ServiceResponse GetDonationById(int id);
    ServiceResponse GetDonationList();
}
