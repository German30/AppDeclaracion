using AppDeclaracion.Domain.Common;

namespace AppDeclaracion.Domain.Arrendamiento;

public static class ArrendamientoCalculator
{
    private const decimal PorcentajeDeduccionCiega = 0.35m;

    public static AportacionBaseAcumulable Calcular(IngresoArrendamiento ingreso)
    {
        var deduccion = ingreso.TipoDeduccion == TipoDeduccionArrendamiento.Ciega35Porciento
            ? ingreso.IngresosCobrados * PorcentajeDeduccionCiega
            : Math.Min(ingreso.TotalDeduccionesReales, ingreso.IngresosCobrados);

        var baseGravable = Math.Max(0m, ingreso.IngresosCobrados - deduccion);

        return new AportacionBaseAcumulable(
            IngresoAcumulable: baseGravable,
            PagosAnticipados: ingreso.PagosProvisionalesRealizados);
    }
}
