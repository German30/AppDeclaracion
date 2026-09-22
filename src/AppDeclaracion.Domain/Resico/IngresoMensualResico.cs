namespace AppDeclaracion.Domain.Resico;

public class IngresoMensualResico
{
    private IngresoMensualResico() { }

    public IngresoMensualResico(int mes, decimal ingresoCobrado, decimal retencionIsr)
    {
        if (mes is < 1 or > 12)
        {
            throw new ArgumentOutOfRangeException(nameof(mes), "El mes debe estar entre 1 y 12.");
        }

        if (ingresoCobrado < 0 || retencionIsr < 0)
        {
            throw new ArgumentException("Los importes no pueden ser negativos.");
        }

        Mes = mes;
        IngresoCobrado = ingresoCobrado;
        RetencionIsr = retencionIsr;
    }

    public int Id { get; private set; }

    public int Mes { get; private set; }

    public decimal IngresoCobrado { get; private set; }

    public decimal RetencionIsr { get; private set; }
}
