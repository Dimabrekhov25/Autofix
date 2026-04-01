using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.DecodeVin;

public sealed record DecodeVinQuery(string Vin) : IRequest<VinDecodeResultDto>;
