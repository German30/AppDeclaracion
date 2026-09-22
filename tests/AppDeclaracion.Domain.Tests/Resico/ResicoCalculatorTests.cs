using AppDeclaracion.Domain.Resico;

namespace AppDeclaracion.Domain.Tests.Resico;

public class ResicoCalculatorTests
{
    [Theory]
    [InlineData(20000, 200.00)]
    [InlineData(50000, 550.00)]
    [InlineData(100000, 2000.00)]
    [InlineData(300000, 7500.00)]
    public void CalcularIsrMensual_AplicaLaTasaDelTramoCorrespondiente(decimal ingreso, decimal isrEsperado)
    {
        var isr = ResicoCalculator.CalcularIsrMensual(ingreso);

        Assert.Equal(isrEsperado, isr);
    }

    [Fact]
    public void CalcularAnual_SumaElIsrMensualDeCadaMesCapturado()
    {
        var ingreso = new IngresoResico(Guid.NewGuid());
        ingreso.EstablecerMes(1, 20000m, 0m);
        ingreso.EstablecerMes(2, 30000m, 0m);

        var resultado = ResicoCalculator.CalcularAnual(ingreso);

        Assert.Equal(50000m, resultado.IngresoAnual);
        Assert.Equal(530.00m, resultado.IsrCausadoAnual);
        Assert.False(resultado.ExcedeLimiteAnual);
    }

    [Fact]
    public void CalcularAnual_MarcaExcedeLimiteCuandoSuperaElTopeAnual()
    {
        var ingreso = new IngresoResico(Guid.NewGuid());
        for (var mes = 1; mes <= 12; mes++)
        {
            ingreso.EstablecerMes(mes, 300_000m, 0m);
        }

        var resultado = ResicoCalculator.CalcularAnual(ingreso);

        Assert.Equal(3_600_000m, resultado.IngresoAnual);
        Assert.True(resultado.ExcedeLimiteAnual);
    }

    [Fact]
    public void CalcularAnual_ElSaldoConsideraLasRetencionesReportadas()
    {
        var ingreso = new IngresoResico(Guid.NewGuid());
        ingreso.EstablecerMes(1, 20000m, 250m);

        var resultado = ResicoCalculator.CalcularAnual(ingreso);

        Assert.Equal(-50m, resultado.Saldo);
        Assert.True(resultado.EsSaldoAFavor);
    }
}
