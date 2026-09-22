namespace AppDeclaracion.Domain.Arrendamiento;

public class IngresoArrendamiento
{
    private readonly List<DeduccionArrendamiento> _deducciones = [];

    private IngresoArrendamiento() { }

    public IngresoArrendamiento(
        Guid declaracionAnualId,
        decimal ingresosCobrados,
        TipoDeduccionArrendamiento tipoDeduccion,
        decimal pagosProvisionalesRealizados)
    {
        if (ingresosCobrados < 0 || pagosProvisionalesRealizados < 0)
        {
            throw new ArgumentException("Los importes no pueden ser negativos.");
        }

        DeclaracionAnualId = declaracionAnualId;
        IngresosCobrados = ingresosCobrados;
        TipoDeduccion = tipoDeduccion;
        PagosProvisionalesRealizados = pagosProvisionalesRealizados;
    }

    public int Id { get; private set; }

    public Guid DeclaracionAnualId { get; private set; }

    public decimal IngresosCobrados { get; private set; }

    public TipoDeduccionArrendamiento TipoDeduccion { get; private set; }

    public decimal PagosProvisionalesRealizados { get; private set; }

    public IReadOnlyCollection<DeduccionArrendamiento> Deducciones => _deducciones.AsReadOnly();

    public void AgregarDeduccion(string concepto, decimal monto)
    {
        if (TipoDeduccion != TipoDeduccionArrendamiento.Real)
        {
            throw new InvalidOperationException(
                "Solo se pueden capturar deducciones reales cuando el tipo de deducción es Real.");
        }

        _deducciones.Add(new DeduccionArrendamiento(concepto, monto));
    }

    public decimal TotalDeduccionesReales => _deducciones.Sum(d => d.Monto);
}
