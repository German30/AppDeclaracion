using AppDeclaracion.Domain.Declaraciones;

namespace AppDeclaracion.Domain.Tests.Declaraciones;

public class DeduccionesPersonalesCalculatorTests
{
    [Fact]
    public void CalcularMontoAplicable_ConIngresoAlto_ElTopeEsLas5Umas()
    {
        var declaracionId = Guid.NewGuid();
        var deducciones = new[]
        {
            new DeduccionPersonal(declaracionId, TipoDeduccionPersonal.HonorariosMedicosYDentales, 250_000m),
        };

        var aplicable = DeduccionesPersonalesCalculator.CalcularMontoAplicable(deducciones, 2_000_000m);

        Assert.Equal(198_140.25m, aplicable);
    }

    [Fact]
    public void CalcularMontoAplicable_ConIngresoBajo_ElTopeEsEl15PorcientoDelIngreso()
    {
        var declaracionId = Guid.NewGuid();
        var deducciones = new[]
        {
            new DeduccionPersonal(declaracionId, TipoDeduccionPersonal.Colegiaturas, 200_000m),
        };

        var aplicable = DeduccionesPersonalesCalculator.CalcularMontoAplicable(deducciones, 1_000_000m);

        Assert.Equal(150_000m, aplicable);
    }

    [Fact]
    public void CalcularMontoAplicable_CuandoElTotalDeducidoNoAlcanzaElTope_SeAplicaElTotal()
    {
        var declaracionId = Guid.NewGuid();
        var deducciones = new[]
        {
            new DeduccionPersonal(declaracionId, TipoDeduccionPersonal.GastosFunerales, 10_000m),
        };

        var aplicable = DeduccionesPersonalesCalculator.CalcularMontoAplicable(deducciones, 100_000m);

        Assert.Equal(10_000m, aplicable);
    }
}
