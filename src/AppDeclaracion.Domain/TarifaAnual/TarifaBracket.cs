namespace AppDeclaracion.Domain.TarifaAnual;

/// <summary>
/// Rango de la tarifa anual del ISR (marginal): al excedente sobre el límite
/// inferior se le aplica el porcentaje del rango y se suma la cuota fija.
/// </summary>
public sealed record TarifaBracket(
    decimal LimiteInferior,
    decimal LimiteSuperior,
    decimal CuotaFija,
    decimal PorcentajeExcedente)
{
    public bool Contiene(decimal baseGravable) =>
        baseGravable >= LimiteInferior && baseGravable <= LimiteSuperior;
}
