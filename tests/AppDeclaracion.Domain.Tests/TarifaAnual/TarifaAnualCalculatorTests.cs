using AppDeclaracion.Domain.TarifaAnual;

namespace AppDeclaracion.Domain.Tests.TarifaAnual;

public class TarifaAnualCalculatorTests
{
    [Fact]
    public void CalcularIsr_ConBaseCeroOMenor_RegresaCero()
    {
        Assert.Equal(0m, TarifaAnualCalculator.CalcularIsr(0m));
        Assert.Equal(0m, TarifaAnualCalculator.CalcularIsr(-100m));
    }

    [Fact]
    public void CalcularIsr_EnElPrimerTramo_AplicaSoloElPorcentajeSobreExcedente()
    {
        var isr = TarifaAnualCalculator.CalcularIsr(8_952.49m);

        Assert.Equal(171.89m, isr);
    }

    [Fact]
    public void CalcularIsr_EnUnTramoIntermedio_SumaCuotaFijaYExcedente()
    {
        var isr = TarifaAnualCalculator.CalcularIsr(1_000_000m);

        Assert.Equal(233_603.94m, isr);
    }

    [Fact]
    public void CalcularIsr_EnElUltimoTramo_AplicaLaTasaMaxima()
    {
        var isr = TarifaAnualCalculator.CalcularIsr(10_000_000m);

        Assert.Equal(3_335_850.27m, isr);
    }
}
