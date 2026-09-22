namespace AppDeclaracion.Application.Declaraciones.Dtos;

public sealed record DeduccionActividadRequest(string Concepto, decimal Monto);

public sealed record EstablecerIngresoActividadEmpresarialRequest(
    decimal IngresosCobrados,
    decimal PagosProvisionalesRealizados,
    List<DeduccionActividadRequest> Deducciones);

public sealed record IngresoActividadEmpresarialDto(
    decimal IngresosCobrados,
    decimal PagosProvisionalesRealizados,
    decimal TotalDeducciones,
    IReadOnlyList<DeduccionActividadRequest> Deducciones);
