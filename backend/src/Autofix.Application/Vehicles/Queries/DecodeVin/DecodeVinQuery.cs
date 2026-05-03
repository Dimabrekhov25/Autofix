using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.DecodeVin;

/// <summary>
/// Decodes or looks up vehicle metadata for a VIN.
/// </summary>
public sealed record DecodeVinQuery(string Vin) : IRequest<VinDecodeResultDto>;
