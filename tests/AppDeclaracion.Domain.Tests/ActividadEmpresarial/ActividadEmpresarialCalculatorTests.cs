using AppDeclaracion.Domain.ActividadEmpresarial;

namespace AppDeclaracion.Domain.Tests.ActividadEmpresarial;

public class ActividadEmpresarialCalculatorTests
{
    [Fact]
    public void Calcular_LaUtilidadFiscalEsIngresosMenosDeducciones()
    {
        var ingreso = new IngresoActividadEmpresarial(Guid.NewGuid(), 1_000_000m, 50_000m);
        ingreso.AgregarDeduccion("Renta de oficina", 200_000m);
        ingreso.AgregarDeduccion("Insumos", 150_000m);

        var aportacion = ActividadEmpresarialCalculator.Calcular(ingreso);

        Assert.Equal(650_000m, aportacion.IngresoAcumulable);
        Assert.Equal(50_000m, aportacion.PagosAnticipados);
    }

    [Fact]
    public void Calcular_CuandoLasDeduccionesSuperanLosIngresos_LaUtilidadSeAcotaACero()
    {
        var ingreso = new IngresoActividadEmpresarial(Guid.NewGuid(), 100_000m, 0m);
        ingreso.AgregarDeduccion("Gastos", 150_000m);

        var aportacion = ActividadEmpresarialCalculator.Calcular(ingreso);

        Assert.Equal(0m, aportacion.IngresoAcumulable);
    }
}
