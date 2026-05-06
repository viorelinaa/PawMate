using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IStatisticsLogic
{
    ServiceResponse GetSummary();
}
