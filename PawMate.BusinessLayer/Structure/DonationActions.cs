using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Donation;
using PawMate.Domain.Models.Donation;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class DonationActions
{
    private readonly PawMateDbContext _context;

    public DonationActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateDonationAction(DonationCreateDto dto)
    {
        try
        {
            var entity = new DonationEntity
            {
                Name = dto.Name,
                City = dto.City,
                Type = dto.Type,
                DonationLink = dto.DonationLink,
                Description = dto.Description
            };

            _context.Donations.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Organizația a fost adăugată cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la adăugarea organizației: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetDonationByIdAction(int id)
    {
        try
        {
            var entity = _context.Donations.FirstOrDefault(d => d.Id == id);
            if (entity == null)
                return new ServiceResponse { IsSuccess = false, Message = "Organizația nu a fost găsită." };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Organizația a fost găsită.",
                Data = new DonationInfoDto
                {
                    Id = entity.Id,
                    Name = entity.Name,
                    City = entity.City,
                    Type = entity.Type,
                    DonationLink = entity.DonationLink,
                    Description = entity.Description
                }
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare la obținerea organizației: {ex.Message}" };
        }
    }

    public ServiceResponse GetDonationListAction()
    {
        try
        {
            var list = _context.Donations
                .OrderBy(d => d.Name)
                .Select(d => new DonationInfoDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    City = d.City,
                    Type = d.Type,
                    DonationLink = d.DonationLink,
                    Description = d.Description
                })
                .ToList();

            return new ServiceResponse { IsSuccess = true, Message = "Lista organizațiilor a fost obținută cu succes.", Data = list };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare la obținerea listei: {ex.Message}" };
        }
    }

    public ServiceResponse UpdateDonationAction(int id, DonationUpdateDto dto)
    {
        try
        {
            var entity = _context.Donations.FirstOrDefault(d => d.Id == id);
            if (entity == null)
                return new ServiceResponse { IsSuccess = false, Message = "Organizația nu a fost găsită." };

            entity.Name = dto.Name;
            entity.City = dto.City;
            entity.Type = dto.Type;
            entity.DonationLink = dto.DonationLink;
            entity.Description = dto.Description;

            _context.SaveChanges();

            return new ServiceResponse { IsSuccess = true, Message = "Organizația a fost actualizată cu succes." };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare la actualizarea organizației: {ex.Message}" };
        }
    }

    public ServiceResponse DeleteDonationAction(int id)
    {
        try
        {
            var entity = _context.Donations.FirstOrDefault(d => d.Id == id);
            if (entity == null)
                return new ServiceResponse { IsSuccess = false, Message = "Organizația nu a fost găsită." };

            _context.Donations.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse { IsSuccess = true, Message = "Organizația a fost ștearsă cu succes." };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare la ștergerea organizației: {ex.Message}" };
        }
    }
}
