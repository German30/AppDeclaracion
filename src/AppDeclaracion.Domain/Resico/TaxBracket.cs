namespace AppDeclaracion.Domain.Resico;

/// <summary>
/// Rango de la tabla de tasas RESICO. A diferencia de la tarifa general del ISR,
/// la tasa se aplica de forma directa (no marginal) sobre la totalidad del ingreso
/// mensual una vez identificado el rango en el que cae.
/// </summary>
public sealed record TaxBracket(decimal LimiteInferior, decimal LimiteSuperior, decimal Tasa)
{
    public bool Contiene(decimal ingreso) => ingreso >= LimiteInferior && ingreso <= LimiteSuperior;
}
