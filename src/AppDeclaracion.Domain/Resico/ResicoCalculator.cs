namespace AppDeclaracion.Domain.Resico;

/// <summary>
/// RESICO es un régimen cedular: su ISR se calcula mes a mes sobre el ingreso
/// efectivamente cobrado y no se mezcla con la tarifa anual de los demás regímenes.
/// </summary>
public static class ResicoCalculator
{
    public static decimal CalcularIsrMensual(decimal ingresoCobrado)
    {
        var tasa = ResicoTaxTables.ObtenerTasa(ingresoCobrado);
        return Math.Round(ingresoCobrado * tasa, 2, MidpointRounding.AwayFromZero);
    }

    public static ResicoResultado CalcularAnual(IngresoResico ingreso)
    {
        var isrCausadoAnual = ingreso.Meses.Sum(m => CalcularIsrMensual(m.IngresoCobrado));

        return new ResicoResultado(
            IngresoAnual: ingreso.IngresoAnual,
            IsrCausadoAnual: isrCausadoAnual,
            IsrRetenidoAnual: ingreso.RetencionAnual,
            ExcedeLimiteAnual: ingreso.IngresoAnual > ResicoTaxTables.LimiteIngresoAnual);
    }
}
