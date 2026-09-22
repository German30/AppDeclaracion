namespace AppDeclaracion.Domain.ActividadEmpresarial;

public class IngresoActividadEmpresarial
{
    private readonly List<DeduccionActividad> _deducciones = [];

    private IngresoActividadEmpresarial() { }

    public IngresoActividadEmpresarial(Guid declaracionAnualId, decimal ingresosCobrados, decimal pagosProvisionalesRealizados)
    {
        if (ingresosCobrados < 0 || pagosProvisionalesRealizados < 0)
        {
            throw new ArgumentException("Los importes no pueden ser negativos.");
        }

        DeclaracionAnualId = declaracionAnualId;
        IngresosCobrados = ingresosCobrados;
        PagosProvisionalesRealizados = pagosProvisionalesRealizados;
    }

    public int Id { get; private set; }

    public Guid DeclaracionAnualId { get; private set; }

    public decimal IngresosCobrados { get; private set; }

    public decimal PagosProvisionalesRealizados { get; private set; }

    public IReadOnlyCollection<DeduccionActividad> Deducciones => _deducciones.AsReadOnly();

    public void AgregarDeduccion(string concepto, decimal monto) =>
        _deducciones.Add(new DeduccionActividad(concepto, monto));

    public decimal TotalDeducciones => _deducciones.Sum(d => d.Monto);
}
