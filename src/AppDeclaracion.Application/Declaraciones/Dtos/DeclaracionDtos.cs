using AppDeclaracion.Domain.Declaraciones;

namespace AppDeclaracion.Application.Declaraciones.Dtos;

public sealed record CrearDeclaracionRequest(int Ejercicio);

public sealed record DeduccionPersonalRequest(TipoDeduccionPersonal Tipo, decimal Monto);

public sealed record EstablecerDeduccionesPersonalesRequest(List<DeduccionPersonalRequest> Deducciones);

public sealed record DeduccionPersonalDto(TipoDeduccionPersonal Tipo, decimal Monto);

public sealed record ResultadoCalculoDto(
    decimal IsrResicoCausado,
    decimal IsrResicoRetenido,
    decimal SaldoResico,
    decimal IngresoAcumulableTotal,
    decimal DeduccionesPersonalesAplicadas,
    decimal BaseGravableAcumulable,
    decimal IsrCausadoAcumulable,
    decimal PagosAnticipadosAcumulable,
    decimal SaldoAcumulable,
    decimal SaldoTotal,
    bool EsSaldoAFavor,
    DateTime FechaCalculo);

public sealed record DeclaracionResumenDto(Guid Id, int Ejercicio, EstatusDeclaracion Estatus, DateTime FechaCreacion);

public sealed record DeclaracionDetalleDto(
    Guid Id,
    int Ejercicio,
    EstatusDeclaracion Estatus,
    DateTime FechaCreacion,
    IngresoResicoDto? IngresoResico,
    IngresoSueldosDto? IngresoSueldos,
    IngresoActividadEmpresarialDto? IngresoActividadEmpresarial,
    IngresoArrendamientoDto? IngresoArrendamiento,
    IReadOnlyList<DeduccionPersonalDto> DeduccionesPersonales,
    ResultadoCalculoDto? Resultado);
