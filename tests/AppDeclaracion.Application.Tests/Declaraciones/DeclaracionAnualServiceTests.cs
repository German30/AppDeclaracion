using AppDeclaracion.Application.Declaraciones;
using AppDeclaracion.Application.Declaraciones.Dtos;
using AppDeclaracion.Domain.Arrendamiento;
using AppDeclaracion.Domain.Declaraciones;

namespace AppDeclaracion.Application.Tests.Declaraciones;

public class DeclaracionAnualServiceTests
{
    private readonly FakeDeclaracionRepository _repositorio = new();
    private readonly DeclaracionAnualService _servicio;
    private readonly Guid _usuarioId = Guid.NewGuid();

    public DeclaracionAnualServiceTests()
    {
        _servicio = new DeclaracionAnualService(_repositorio);
    }

    [Fact]
    public async Task CrearAsync_PersisteLaDeclaracionParaElUsuario()
    {
        var resumen = await _servicio.CrearAsync(_usuarioId, new CrearDeclaracionRequest(2024), CancellationToken.None);

        Assert.Equal(2024, resumen.Ejercicio);
        Assert.Equal(EstatusDeclaracion.Borrador, resumen.Estatus);

        var listado = await _servicio.ListarAsync(_usuarioId, CancellationToken.None);
        Assert.Single(listado);
    }

    [Fact]
    public async Task ObtenerAsync_ConDeclaracionDeOtroUsuario_Lanza()
    {
        var resumen = await _servicio.CrearAsync(_usuarioId, new CrearDeclaracionRequest(2024), CancellationToken.None);
        var otroUsuarioId = Guid.NewGuid();

        await Assert.ThrowsAsync<DeclaracionNoEncontradaException>(
            () => _servicio.ObtenerAsync(resumen.Id, otroUsuarioId, CancellationToken.None));
    }

    [Fact]
    public async Task CalcularAsync_ConsolidaLosCuatroRegimenesYLasDeduccionesPersonales()
    {
        var resumen = await _servicio.CrearAsync(_usuarioId, new CrearDeclaracionRequest(2024), CancellationToken.None);

        await _servicio.EstablecerIngresoResicoAsync(
            resumen.Id, _usuarioId,
            new EstablecerIngresoResicoRequest([new IngresoMensualResicoRequest(1, 20_000m, 0m)]),
            CancellationToken.None);

        await _servicio.EstablecerIngresoSueldosAsync(
            resumen.Id, _usuarioId,
            new EstablecerIngresoSueldosRequest(300_000m, 20_000m),
            CancellationToken.None);

        await _servicio.EstablecerIngresoActividadEmpresarialAsync(
            resumen.Id, _usuarioId,
            new EstablecerIngresoActividadEmpresarialRequest(
                500_000m, 30_000m, [new DeduccionActividadRequest("Insumos", 100_000m)]),
            CancellationToken.None);

        await _servicio.EstablecerIngresoArrendamientoAsync(
            resumen.Id, _usuarioId,
            new EstablecerIngresoArrendamientoRequest(200_000m, TipoDeduccionArrendamiento.Ciega35Porciento, 5_000m, []),
            CancellationToken.None);

        await _servicio.EstablecerDeduccionesPersonalesAsync(
            resumen.Id, _usuarioId,
            new EstablecerDeduccionesPersonalesRequest(
                [new DeduccionPersonalRequest(TipoDeduccionPersonal.Colegiaturas, 50_000m)]),
            CancellationToken.None);

        var resultado = await _servicio.CalcularAsync(resumen.Id, _usuarioId, CancellationToken.None);

        Assert.Equal(200.00m, resultado.IsrResicoCausado);
        Assert.Equal(830_000m, resultado.IngresoAcumulableTotal);
        Assert.Equal(50_000m, resultado.DeduccionesPersonalesAplicadas);
        Assert.Equal(780_000m, resultado.BaseGravableAcumulable);
        Assert.Equal(167_603.94m, resultado.IsrCausadoAcumulable);
        Assert.Equal(55_000m, resultado.PagosAnticipadosAcumulable);
        Assert.Equal(112_603.94m, resultado.SaldoAcumulable);
        Assert.Equal(112_803.94m, resultado.SaldoTotal);
        Assert.False(resultado.EsSaldoAFavor);

        var detalle = await _servicio.ObtenerAsync(resumen.Id, _usuarioId, CancellationToken.None);
        Assert.Equal(EstatusDeclaracion.Calculada, detalle.Estatus);
        Assert.NotNull(detalle.Resultado);
    }
}
