using AppDeclaracion.Domain.SueldosYSalarios;

namespace AppDeclaracion.Domain.Tests.SueldosYSalarios;

public class SueldosCalculatorTests
{
    [Fact]
    public void Calcular_TrasladaElIngresoGravadoYElIsrRetenidoReportados()
    {
        var ingreso = new IngresoSueldos(Guid.NewGuid(), 500_000m, 80_000m);

        var aportacion = SueldosCalculator.Calcular(ingreso);

        Assert.Equal(500_000m, aportacion.IngresoAcumulable);
        Assert.Equal(80_000m, aportacion.PagosAnticipados);
    }
}
