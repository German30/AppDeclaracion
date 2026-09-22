namespace AppDeclaracion.Domain.TarifaAnual;

public static class TarifaAnualCalculator
{
    public static decimal CalcularIsr(decimal baseGravable)
    {
        if (baseGravable <= 0)
        {
            return 0m;
        }

        var tramo = AnualTaxTables.ObtenerTramo(baseGravable);
        var excedente = baseGravable - tramo.LimiteInferior;
        var isr = tramo.CuotaFija + (excedente * tramo.PorcentajeExcedente);

        return Math.Round(isr, 2, MidpointRounding.AwayFromZero);
    }
}
