using AppDeclaracion.Domain.Common;

namespace AppDeclaracion.Domain.Declaraciones;

/// <summary>
/// Aplica únicamente el tope general de las deducciones personales (Art. 151 LISR,
/// último párrafo): la menor cantidad entre 5 UMAs anuales y el 15% del total de
/// ingresos del contribuyente. Simplificación deliberada: no modela los topes
/// particulares por tipo de deducción (p. ej. colegiaturas por nivel educativo o
/// donativos limitados al 7% del ingreso acumulable del ejercicio anterior).
/// </summary>
public static class DeduccionesPersonalesCalculator
{
    public static decimal CalcularMontoAplicable(
        IEnumerable<DeduccionPersonal> deducciones,
        decimal ingresoTotalContribuyente)
    {
        var totalDeducido = deducciones.Sum(d => d.Monto);
        var topeGeneral = Math.Min(5 * ParametrosFiscales.UmaAnual, ingresoTotalContribuyente * 0.15m);

        return Math.Min(totalDeducido, Math.Max(0m, topeGeneral));
    }
}
