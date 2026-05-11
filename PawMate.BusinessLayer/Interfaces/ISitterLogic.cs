using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Sitter;

namespace PawMate.BusinessLayer.Interfaces;

public interface ISitterLogic
{
    ServiceResponse CreateSitter(SitterCreateDto sitter);
    ServiceResponse GetSitterById(int id);
    ServiceResponse GetSitterList(SitterQueryDto query);
    ServiceResponse UpdateSitter(int id, SitterUpdateDto sitter);
    ServiceResponse DeleteSitter(int id);
}