namespace AppDeclaracion.Domain.Arrendamiento;

public class DeduccionArrendamiento
{
    private DeduccionArrendamiento() { }

    public DeduccionArrendamiento(string concepto, decimal monto)
    {
        if (string.IsNullOrWhiteSpace(concepto))
        {
            throw new ArgumentException("El concepto es obligatorio.", nameof(concepto));
        }

        if (monto < 0)
        {
            throw new ArgumentException("El monto no puede ser negativo.", nameof(monto));
        }

        Concepto = concepto;
        Monto = monto;
    }

    public int Id { get; private set; }

    public int IngresoArrendamientoId { get; private set; }

    public string Concepto { get; private set; } = string.Empty;

    public decimal Monto { get; private set; }
}
