namespace AppDeclaracion.Application.Declaraciones.Dtos;

public sealed record EstablecerIngresoSueldosRequest(decimal IngresoGravado, decimal IsrRetenido);

public sealed record IngresoSueldosDto(decimal IngresoGravado, decimal IsrRetenido);
