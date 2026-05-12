using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Sitter;

namespace PawMate.BusinessLayer.Core;

public class SitterLogic : SitterActions, ISitterLogic
{
    public ServiceResponse CreateSitter(SitterCreateDto sitter)
    {
        return CreateSitterAction(sitter);
    }

    public ServiceResponse GetSitterById(int id)
    {
        return GetSitterByIdAction(id);
    }

    public ServiceResponse GetSitterList(SitterQueryDto query)
    {
        return GetSitterListAction(query);
    }

    public ServiceResponse UpdateSitter(int id, SitterUpdateDto sitter)
    {
        return UpdateSitterAction(id, sitter);
    }

    public ServiceResponse DeleteSitter(int id)
    {
        return DeleteSitterAction(id);
    }
}