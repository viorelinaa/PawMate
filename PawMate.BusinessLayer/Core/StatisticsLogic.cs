using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class StatisticsLogic : StatisticsActions, IStatisticsLogic
{
    public ServiceResponse GetSummary()
    {
        return GetSummaryAction();
    }
}
