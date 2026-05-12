namespace PawMate.Domain.Models.Event;

public class EventQueryDto
{
    public string? Search { get; set; }
    public string? Location { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
}
