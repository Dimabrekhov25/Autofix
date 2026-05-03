namespace Autofix.Application.Statistics.Dtos;

public class VehicleStatisticsDto
{
    public int TotalVehicles { get; set; }
    public int ActiveVehicles { get; set; }
    public Dictionary<string, int> VehiclesByMake { get; set; } = new();
    public Dictionary<string, int> VehiclesByYear { get; set; } = new();
}
