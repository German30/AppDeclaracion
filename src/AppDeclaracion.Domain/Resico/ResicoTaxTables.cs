namespace AppDeclaracion.Domain.Resico;

// Tabla de tasas RESICO Personas Físicas (Art. 113-E LISR). Sin cambios desde su
// entrada en vigor en 2022; verificar contra la publicación vigente del SAT/DOF.
public static class ResicoTaxTables
{
    public const decimal LimiteIngresoAnual = 3_500_000m;

    public static readonly IReadOnlyList<TaxBracket> TasasMensuales =
    [
        new TaxBracket(0.01m, 25_000.00m, 0.010m),
        new TaxBracket(25_000.01m, 50_000.00m, 0.011m),
        new TaxBracket(50_000.01m, 83_333.33m, 0.015m),
        new TaxBracket(83_333.34m, 208_333.33m, 0.020m),
        new TaxBracket(208_333.34m, 3_500_000.00m, 0.025m),
    ];

    public static decimal ObtenerTasa(decimal ingresoMensual)
    {
        if (ingresoMensual <= 0)
        {
            return 0m;
        }

        var tramo = TasasMensuales.FirstOrDefault(t => t.Contiene(ingresoMensual))
            ?? TasasMensuales[^1];

        return tramo.Tasa;
    }
}
