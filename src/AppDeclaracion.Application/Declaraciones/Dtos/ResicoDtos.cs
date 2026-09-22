namespace AppDeclaracion.Application.Declaraciones.Dtos;

public sealed record IngresoMensualResicoRequest(int Mes, decimal IngresoCobrado, decimal RetencionIsr);

public sealed record EstablecerIngresoResicoRequest(List<IngresoMensualResicoRequest> Meses);

public sealed record IngresoMensualResicoDto(int Mes, decimal IngresoCobrado, decimal RetencionIsr);

public sealed record IngresoResicoDto(
    decimal IngresoAnual,
    decimal RetencionAnual,
    IReadOnlyList<IngresoMensualResicoDto> Meses);
