using Autofix.Application.Common.Interfaces;
using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.DecodeVin;

public sealed class DecodeVinHandler(IVehicleRepository vehicleRepository)
    : IRequestHandler<DecodeVinQuery, VinDecodeResultDto>
{
    public async Task<VinDecodeResultDto> Handle(DecodeVinQuery request, CancellationToken cancellationToken)
    {
        // VIN normalization ensures cache/repository lookup and fallback logic use one canonical value.
        var normalizedVin = request.Vin.Trim().ToUpperInvariant();
        var existingVehicle = await vehicleRepository.GetByVinAsync(normalizedVin, cancellationToken);

        if (existingVehicle is not null)
        {
            return new VinDecodeResultDto(
                existingVehicle.Vin ?? normalizedVin,
                true,
                existingVehicle.Make,
                existingVehicle.Model,
                existingVehicle.Year,
                existingVehicle.Trim,
                existingVehicle.Engine);
        }

        return new VinDecodeResultDto(
            normalizedVin,
            false,
            null,
            null,
            // Fallback decodes model year locally when VIN is not found in repository.
            DecodeModelYear(normalizedVin),
            null,
            null);
    }

    private static int? DecodeModelYear(string vin)
    {
        // Basic VIN-year decoding uses the 10th character mapping for 2010-2039 cycle.
        if (vin.Length != 17)
        {
            return null;
        }

        return vin[9] switch
        {
            'A' => 2010,
            'B' => 2011,
            'C' => 2012,
            'D' => 2013,
            'E' => 2014,
            'F' => 2015,
            'G' => 2016,
            'H' => 2017,
            'J' => 2018,
            'K' => 2019,
            'L' => 2020,
            'M' => 2021,
            'N' => 2022,
            'P' => 2023,
            'R' => 2024,
            'S' => 2025,
            'T' => 2026,
            'V' => 2027,
            'W' => 2028,
            'X' => 2029,
            'Y' => 2030,
            '1' => 2031,
            '2' => 2032,
            '3' => 2033,
            '4' => 2034,
            '5' => 2035,
            '6' => 2036,
            '7' => 2037,
            '8' => 2038,
            '9' => 2039,
            _ => null
        };
    }
}
