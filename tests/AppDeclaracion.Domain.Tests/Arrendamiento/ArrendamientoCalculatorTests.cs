using AppDeclaracion.Domain.Arrendamiento;

namespace AppDeclaracion.Domain.Tests.Arrendamiento;

public class ArrendamientoCalculatorTests
{
    [Fact]
    public void Calcular_ConDeduccionCiega_Aplica35PorcientoDeLosIngresos()
    {
        var ingreso = new IngresoArrendamiento(Guid.NewGuid(), 200_000m, TipoDeduccionArrendamiento.Ciega35Porciento, 5_000m);

        var aportacion = ArrendamientoCalculator.Calcular(ingreso);

        Assert.Equal(130_000m, aportacion.IngresoAcumulable);
        Assert.Equal(5_000m, aportacion.PagosAnticipados);
    }

    [Fact]
    public void Calcular_ConDeduccionReal_SumaLosGastosCapturados()
    {
        var ingreso = new IngresoArrendamiento(Guid.NewGuid(), 200_000m, TipoDeduccionArrendamiento.Real, 3_000m);
        ingreso.AgregarDeduccion("Predial", 80_000m);
        ingreso.AgregarDeduccion("Mantenimiento", 30_000m);

        var aportacion = ArrendamientoCalculator.Calcular(ingreso);

        Assert.Equal(90_000m, aportacion.IngresoAcumulable);
    }

    [Fact]
    public void Calcular_ConDeduccionRealMayorAlIngreso_LaBaseSeAcotaACero()
    {
        var ingreso = new IngresoArrendamiento(Guid.NewGuid(), 100_000m, TipoDeduccionArrendamiento.Real, 0m);
        ingreso.AgregarDeduccion("Remodelación", 150_000m);

        var aportacion = ArrendamientoCalculator.Calcular(ingreso);

        Assert.Equal(0m, aportacion.IngresoAcumulable);
    }

    [Fact]
    public void AgregarDeduccion_ConTipoCiega_Lanza()
    {
        var ingreso = new IngresoArrendamiento(Guid.NewGuid(), 100_000m, TipoDeduccionArrendamiento.Ciega35Porciento, 0m);

        Assert.Throws<InvalidOperationException>(() => ingreso.AgregarDeduccion("Predial", 1_000m));
    }
}
