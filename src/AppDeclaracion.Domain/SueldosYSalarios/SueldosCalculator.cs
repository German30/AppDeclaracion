using AppDeclaracion.Domain.Common;

namespace AppDeclaracion.Domain.SueldosYSalarios;

/// <summary>
/// El patrón ya calculó y retuvo el ISR mensual (incluyendo subsidio al empleo);
/// aquí solo se traslada esa información a la base acumulable de la declaración anual.
/// </summary>
public static class SueldosCalculator
{
    public static AportacionBaseAcumulable Calcular(IngresoSueldos ingreso) =>
        new(IngresoAcumulable: ingreso.IngresoGravado, PagosAnticipados: ingreso.IsrRetenido);
}
