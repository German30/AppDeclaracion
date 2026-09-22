using AppDeclaracion.Application.Abstractions;
using AppDeclaracion.Application.Declaraciones;
using AppDeclaracion.Application.Declaraciones.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppDeclaracion.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/declaraciones")]
public class DeclaracionesController(DeclaracionAnualService servicio, ICurrentUserService currentUser) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<DeclaracionResumenDto>> Crear(CrearDeclaracionRequest request, CancellationToken ct)
    {
        var resumen = await servicio.CrearAsync(currentUser.UsuarioId, request, ct);
        return CreatedAtAction(nameof(Obtener), new { id = resumen.Id }, resumen);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<DeclaracionResumenDto>>> Listar(CancellationToken ct) =>
        Ok(await servicio.ListarAsync(currentUser.UsuarioId, ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DeclaracionDetalleDto>> Obtener(Guid id, CancellationToken ct) =>
        Ok(await servicio.ObtenerAsync(id, currentUser.UsuarioId, ct));

    [HttpPut("{id:guid}/ingresos/resico")]
    public async Task<ActionResult<IngresoResicoDto>> EstablecerIngresoResico(
        Guid id, EstablecerIngresoResicoRequest request, CancellationToken ct) =>
        Ok(await servicio.EstablecerIngresoResicoAsync(id, currentUser.UsuarioId, request, ct));

    [HttpPut("{id:guid}/ingresos/sueldos")]
    public async Task<ActionResult<IngresoSueldosDto>> EstablecerIngresoSueldos(
        Guid id, EstablecerIngresoSueldosRequest request, CancellationToken ct) =>
        Ok(await servicio.EstablecerIngresoSueldosAsync(id, currentUser.UsuarioId, request, ct));

    [HttpPut("{id:guid}/ingresos/actividad-empresarial")]
    public async Task<ActionResult<IngresoActividadEmpresarialDto>> EstablecerIngresoActividadEmpresarial(
        Guid id, EstablecerIngresoActividadEmpresarialRequest request, CancellationToken ct) =>
        Ok(await servicio.EstablecerIngresoActividadEmpresarialAsync(id, currentUser.UsuarioId, request, ct));

    [HttpPut("{id:guid}/ingresos/arrendamiento")]
    public async Task<ActionResult<IngresoArrendamientoDto>> EstablecerIngresoArrendamiento(
        Guid id, EstablecerIngresoArrendamientoRequest request, CancellationToken ct) =>
        Ok(await servicio.EstablecerIngresoArrendamientoAsync(id, currentUser.UsuarioId, request, ct));

    [HttpPut("{id:guid}/deducciones-personales")]
    public async Task<ActionResult<IReadOnlyList<DeduccionPersonalDto>>> EstablecerDeduccionesPersonales(
        Guid id, EstablecerDeduccionesPersonalesRequest request, CancellationToken ct) =>
        Ok(await servicio.EstablecerDeduccionesPersonalesAsync(id, currentUser.UsuarioId, request, ct));

    [HttpPost("{id:guid}/calcular")]
    public async Task<ActionResult<ResultadoCalculoDto>> Calcular(Guid id, CancellationToken ct) =>
        Ok(await servicio.CalcularAsync(id, currentUser.UsuarioId, ct));
}
