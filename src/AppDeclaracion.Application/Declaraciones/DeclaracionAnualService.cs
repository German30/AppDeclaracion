using AppDeclaracion.Application.Abstractions;
using AppDeclaracion.Application.Declaraciones.Dtos;
using AppDeclaracion.Domain.ActividadEmpresarial;
using AppDeclaracion.Domain.Arrendamiento;
using AppDeclaracion.Domain.Common;
using AppDeclaracion.Domain.Declaraciones;
using AppDeclaracion.Domain.Resico;
using AppDeclaracion.Domain.SueldosYSalarios;
using AppDeclaracion.Domain.TarifaAnual;

namespace AppDeclaracion.Application.Declaraciones;

public sealed class DeclaracionAnualService(IDeclaracionRepository repositorio)
{
    public async Task<DeclaracionResumenDto> CrearAsync(Guid usuarioId, CrearDeclaracionRequest request, CancellationToken ct)
    {
        var declaracion = new DeclaracionAnual(usuarioId, request.Ejercicio);
        await repositorio.AgregarAsync(declaracion, ct);
        await repositorio.GuardarCambiosAsync(ct);

        return MapearResumen(declaracion);
    }

    public async Task<IReadOnlyList<DeclaracionResumenDto>> ListarAsync(Guid usuarioId, CancellationToken ct)
    {
        var declaraciones = await repositorio.ListarPorUsuarioAsync(usuarioId, ct);
        return declaraciones.Select(MapearResumen).ToList();
    }

    public async Task<DeclaracionDetalleDto> ObtenerAsync(Guid id, Guid usuarioId, CancellationToken ct)
    {
        var declaracion = await ObtenerODarErrorAsync(id, usuarioId, ct);
        return MapearDetalle(declaracion);
    }

    public async Task<IngresoResicoDto> EstablecerIngresoResicoAsync(
        Guid id, Guid usuarioId, EstablecerIngresoResicoRequest request, CancellationToken ct)
    {
        var declaracion = await ObtenerODarErrorAsync(id, usuarioId, ct);

        var ingreso = declaracion.EstablecerIngresoResico();
        foreach (var mes in request.Meses)
        {
            ingreso.EstablecerMes(mes.Mes, mes.IngresoCobrado, mes.RetencionIsr);
        }

        await repositorio.GuardarCambiosAsync(ct);
        return MapearIngresoResico(ingreso);
    }

    public async Task<IngresoSueldosDto> EstablecerIngresoSueldosAsync(
        Guid id, Guid usuarioId, EstablecerIngresoSueldosRequest request, CancellationToken ct)
    {
        var declaracion = await ObtenerODarErrorAsync(id, usuarioId, ct);

        declaracion.EstablecerIngresoSueldos(request.IngresoGravado, request.IsrRetenido);

        await repositorio.GuardarCambiosAsync(ct);
        return new IngresoSueldosDto(request.IngresoGravado, request.IsrRetenido);
    }

    public async Task<IngresoActividadEmpresarialDto> EstablecerIngresoActividadEmpresarialAsync(
        Guid id, Guid usuarioId, EstablecerIngresoActividadEmpresarialRequest request, CancellationToken ct)
    {
        var declaracion = await ObtenerODarErrorAsync(id, usuarioId, ct);

        var ingreso = declaracion.EstablecerIngresoActividadEmpresarial(
            request.IngresosCobrados, request.PagosProvisionalesRealizados);
        foreach (var deduccion in request.Deducciones)
        {
            ingreso.AgregarDeduccion(deduccion.Concepto, deduccion.Monto);
        }

        await repositorio.GuardarCambiosAsync(ct);
        return MapearIngresoActividadEmpresarial(ingreso);
    }

    public async Task<IngresoArrendamientoDto> EstablecerIngresoArrendamientoAsync(
        Guid id, Guid usuarioId, EstablecerIngresoArrendamientoRequest request, CancellationToken ct)
    {
        var declaracion = await ObtenerODarErrorAsync(id, usuarioId, ct);

        var ingreso = declaracion.EstablecerIngresoArrendamiento(
            request.IngresosCobrados, request.TipoDeduccion, request.PagosProvisionalesRealizados);

        if (request.TipoDeduccion == TipoDeduccionArrendamiento.Real)
        {
            foreach (var deduccion in request.Deducciones)
            {
                ingreso.AgregarDeduccion(deduccion.Concepto, deduccion.Monto);
            }
        }

        await repositorio.GuardarCambiosAsync(ct);
        return MapearIngresoArrendamiento(ingreso);
    }

    public async Task<IReadOnlyList<DeduccionPersonalDto>> EstablecerDeduccionesPersonalesAsync(
        Guid id, Guid usuarioId, EstablecerDeduccionesPersonalesRequest request, CancellationToken ct)
    {
        var declaracion = await ObtenerODarErrorAsync(id, usuarioId, ct);

        declaracion.EstablecerDeduccionesPersonales(request.Deducciones.Select(d => (d.Tipo, d.Monto)));

        await repositorio.GuardarCambiosAsync(ct);
        return declaracion.DeduccionesPersonales.Select(MapearDeduccionPersonal).ToList();
    }

    public async Task<ResultadoCalculoDto> CalcularAsync(Guid id, Guid usuarioId, CancellationToken ct)
    {
        var declaracion = await ObtenerODarErrorAsync(id, usuarioId, ct);

        var isrResicoCausado = 0m;
        var isrResicoRetenido = 0m;
        var ingresoResicoAnual = 0m;
        if (declaracion.IngresoResico is not null)
        {
            var resico = ResicoCalculator.CalcularAnual(declaracion.IngresoResico);
            isrResicoCausado = resico.IsrCausadoAnual;
            isrResicoRetenido = resico.IsrRetenidoAnual;
            ingresoResicoAnual = resico.IngresoAnual;
        }

        var aportaciones = new List<AportacionBaseAcumulable>();
        if (declaracion.IngresoSueldos is not null)
        {
            aportaciones.Add(SueldosCalculator.Calcular(declaracion.IngresoSueldos));
        }

        if (declaracion.IngresoActividadEmpresarial is not null)
        {
            aportaciones.Add(ActividadEmpresarialCalculator.Calcular(declaracion.IngresoActividadEmpresarial));
        }

        if (declaracion.IngresoArrendamiento is not null)
        {
            aportaciones.Add(ArrendamientoCalculator.Calcular(declaracion.IngresoArrendamiento));
        }

        var ingresoAcumulableTotal = aportaciones.Sum(a => a.IngresoAcumulable);
        var pagosAnticipadosAcumulable = aportaciones.Sum(a => a.PagosAnticipados);

        var ingresoTotalContribuyente = ingresoAcumulableTotal + ingresoResicoAnual;
        var deduccionesAplicadas = DeduccionesPersonalesCalculator.CalcularMontoAplicable(
            declaracion.DeduccionesPersonales, ingresoTotalContribuyente);

        var baseGravableAcumulable = Math.Max(0m, ingresoAcumulableTotal - deduccionesAplicadas);
        var isrCausadoAcumulable = TarifaAnualCalculator.CalcularIsr(baseGravableAcumulable);

        var resultado = new ResultadoCalculo(
            declaracion.Id,
            isrResicoCausado,
            isrResicoRetenido,
            ingresoAcumulableTotal,
            deduccionesAplicadas,
            baseGravableAcumulable,
            isrCausadoAcumulable,
            pagosAnticipadosAcumulable);

        declaracion.AsignarResultado(resultado);
        await repositorio.GuardarCambiosAsync(ct);

        return MapearResultado(resultado);
    }

    private async Task<DeclaracionAnual> ObtenerODarErrorAsync(Guid id, Guid usuarioId, CancellationToken ct) =>
        await repositorio.ObtenerPorIdAsync(id, usuarioId, ct) ?? throw new DeclaracionNoEncontradaException(id);

    private static DeclaracionResumenDto MapearResumen(DeclaracionAnual d) =>
        new(d.Id, d.Ejercicio, d.Estatus, d.FechaCreacion);

    private static IngresoResicoDto MapearIngresoResico(IngresoResico ingreso) => new(
        ingreso.IngresoAnual,
        ingreso.RetencionAnual,
        ingreso.Meses.OrderBy(m => m.Mes).Select(m => new IngresoMensualResicoDto(m.Mes, m.IngresoCobrado, m.RetencionIsr)).ToList());

    private static IngresoActividadEmpresarialDto MapearIngresoActividadEmpresarial(IngresoActividadEmpresarial ingreso) => new(
        ingreso.IngresosCobrados,
        ingreso.PagosProvisionalesRealizados,
        ingreso.TotalDeducciones,
        ingreso.Deducciones.Select(d => new DeduccionActividadRequest(d.Concepto, d.Monto)).ToList());

    private static IngresoArrendamientoDto MapearIngresoArrendamiento(IngresoArrendamiento ingreso) => new(
        ingreso.IngresosCobrados,
        ingreso.TipoDeduccion,
        ingreso.PagosProvisionalesRealizados,
        ingreso.TotalDeduccionesReales,
        ingreso.Deducciones.Select(d => new DeduccionArrendamientoRequest(d.Concepto, d.Monto)).ToList());

    private static DeduccionPersonalDto MapearDeduccionPersonal(DeduccionPersonal d) => new(d.Tipo, d.Monto);

    private static ResultadoCalculoDto MapearResultado(ResultadoCalculo r) => new(
        r.IsrResicoCausado,
        r.IsrResicoRetenido,
        r.SaldoResico,
        r.IngresoAcumulableTotal,
        r.DeduccionesPersonalesAplicadas,
        r.BaseGravableAcumulable,
        r.IsrCausadoAcumulable,
        r.PagosAnticipadosAcumulable,
        r.SaldoAcumulable,
        r.SaldoTotal,
        r.EsSaldoAFavor,
        r.FechaCalculo);

    private static DeclaracionDetalleDto MapearDetalle(DeclaracionAnual d) => new(
        d.Id,
        d.Ejercicio,
        d.Estatus,
        d.FechaCreacion,
        d.IngresoResico is null ? null : MapearIngresoResico(d.IngresoResico),
        d.IngresoSueldos is null ? null : new IngresoSueldosDto(d.IngresoSueldos.IngresoGravado, d.IngresoSueldos.IsrRetenido),
        d.IngresoActividadEmpresarial is null ? null : MapearIngresoActividadEmpresarial(d.IngresoActividadEmpresarial),
        d.IngresoArrendamiento is null ? null : MapearIngresoArrendamiento(d.IngresoArrendamiento),
        d.DeduccionesPersonales.Select(MapearDeduccionPersonal).ToList(),
        d.Resultado is null ? null : MapearResultado(d.Resultado));
}
