using AppDeclaracion.Domain.Declaraciones;

namespace AppDeclaracion.Domain.Tests.Declaraciones;

public class DeclaracionAnualTests
{
    [Fact]
    public void Constructor_IniciaEnBorrador()
    {
        var declaracion = new DeclaracionAnual(Guid.NewGuid(), 2024);

        Assert.Equal(EstatusDeclaracion.Borrador, declaracion.Estatus);
        Assert.Equal(2024, declaracion.Ejercicio);
        Assert.NotEqual(Guid.Empty, declaracion.Id);
    }

    [Theory]
    [InlineData(2019)]
    public void Constructor_ConEjercicioFueraDeRango_Lanza(int ejercicio)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new DeclaracionAnual(Guid.NewGuid(), ejercicio));
    }

    [Fact]
    public void EstablecerIngresoResico_QuedaLigadoALaDeclaracion()
    {
        var declaracion = new DeclaracionAnual(Guid.NewGuid(), 2024);

        var ingreso = declaracion.EstablecerIngresoResico();
        ingreso.EstablecerMes(1, 20_000m, 0m);

        Assert.Same(ingreso, declaracion.IngresoResico);
        Assert.Equal(20_000m, declaracion.IngresoResico!.IngresoAnual);
    }

    [Fact]
    public void AsignarResultado_CambiaElEstatusACalculada()
    {
        var declaracion = new DeclaracionAnual(Guid.NewGuid(), 2024);
        var resultado = new ResultadoCalculo(declaracion.Id, 0m, 0m, 0m, 0m, 0m, 0m, 0m);

        declaracion.AsignarResultado(resultado);

        Assert.Equal(EstatusDeclaracion.Calculada, declaracion.Estatus);
        Assert.Same(resultado, declaracion.Resultado);
    }
}
