namespace AppDeclaracion.Domain.TarifaAnual;

// Tarifa anual del Art. 152 LISR. Estos importes se han mantenido nominalmente
// sin cambio en publicaciones recientes del SAT/DOF; verificar contra el Anexo 8
// de la Resolución Miscelánea Fiscal vigente para el ejercicio que se declara.
public static class AnualTaxTables
{
    public static readonly IReadOnlyList<TarifaBracket> Tarifa =
    [
        new TarifaBracket(0.01m, 8_952.49m, 0.00m, 0.0192m),
        new TarifaBracket(8_952.50m, 75_984.55m, 171.88m, 0.0640m),
        new TarifaBracket(75_984.56m, 133_536.07m, 4_461.94m, 0.1088m),
        new TarifaBracket(133_536.08m, 155_229.80m, 10_723.55m, 0.1600m),
        new TarifaBracket(155_229.81m, 185_852.57m, 14_194.54m, 0.1792m),
        new TarifaBracket(185_852.58m, 374_837.88m, 19_682.13m, 0.2136m),
        new TarifaBracket(374_837.89m, 590_795.99m, 60_049.40m, 0.2352m),
        new TarifaBracket(590_796.00m, 1_127_926.84m, 110_842.74m, 0.3000m),
        new TarifaBracket(1_127_926.85m, 1_503_902.46m, 271_981.99m, 0.3200m),
        new TarifaBracket(1_503_902.47m, 4_511_707.37m, 392_294.17m, 0.3400m),
        new TarifaBracket(4_511_707.38m, decimal.MaxValue, 1_414_947.85m, 0.3500m),
    ];

    public static TarifaBracket ObtenerTramo(decimal baseGravable)
    {
        if (baseGravable <= 0)
        {
            return Tarifa[0];
        }

        return Tarifa.FirstOrDefault(t => t.Contiene(baseGravable)) ?? Tarifa[^1];
    }
}
