using AppDeclaracion.Domain.Arrendamiento;

namespace AppDeclaracion.Application.Declaraciones.Dtos;

public sealed record DeduccionArrendamientoRequest(string Concepto, decimal Monto);

public sealed record EstablecerIngresoArrendamientoRequest(
    decimal IngresosCobrados,
    TipoDeduccionArrendamiento TipoDeduccion,
    decimal PagosProvisionalesRealizados,
    List<DeduccionArrendamientoRequest> Deducciones);

public sealed record IngresoArrendamientoDto(
    decimal IngresosCobrados,
    TipoDeduccionArrendamiento TipoDeduccion,
    decimal PagosProvisionalesRealizados,
    decimal TotalDeduccionesReales,
    IReadOnlyList<DeduccionArrendamientoRequest> Deducciones);
